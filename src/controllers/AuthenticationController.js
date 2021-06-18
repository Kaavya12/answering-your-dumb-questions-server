const { User } = require('../models')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.SECRET_KEY;
const crypto = require('crypto');

function hashHmacSha256(s) {
  return crypto
    .createHmac('sha256', JWT_SECRET_KEY)
    .update(s)
    .digest('hex');
}
function genAccessToken(user) {
  const userId = user.username;
  const type = 'access';

  const tokenPayload = { type, userId };

  const accessToken = jwt.sign(
    tokenPayload,
    JWT_SECRET_KEY,
    { expiresIn: 5*60 }
  );
  return accessToken;
}
function genRefreshToken(user) {
  const userId = user.username;
  const type = 'refresh';

  const password = user.password;
  const key = genKey(userId);

  const tokenPayload = { type, userId, key };

  const refreshToken = jwt.sign(tokenPayload, JWT_SECRET_KEY);
  return refreshToken;
}
function genKey(id) {
  const rawKey = id;
  const key = hashHmacSha256(rawKey, JWT_SECRET_KEY);
  return key;
}
async function register (req, res) {
  try {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const user = await User.create(req.body)
    res.send({
      message: 'User successfully created',
      username: user.username
    })
  } catch (err) {
    let errorMessage
    if (err.errors[0].message === 'email must be unique') {
      errorMessage = 'Email should be unique'
    } else {
      errorMessage = 'Username should be unique'
    }
    res.status(400).send({
      error: errorMessage
    })
  }
}
async function login (req, res) {
  const body = req.body;

  const user = await User.findOne({where: { username: body.username }});
  
  if (user) {
    console.log("User validated")
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (validPassword) {
      const accessToken = genAccessToken(user);
      const refreshToken = genRefreshToken(user);
      console.log("sending response")
      res.status(200).json({ accessToken, refreshToken });

    } else {
      res.status(400).json({ error: "Invalid Password" });
    }
  } else {
    res.status(401).json({ error: "User does not exist" });
  }
}
async function refreshToken (request, response) {
  const refreshToken = request.body.refreshToken;

  try {
    const tokenPayload = jwt.verify(refreshToken, JWT_SECRET_KEY);
    if (tokenPayload.type !== 'refresh') throw new Error('wrong token type');

    const userId = tokenPayload.userId;
    const userInDb = await User.findOne({where: {username: userId}});

    const keyToCompare = genKey(userId);
    if (keyToCompare !== tokenPayload.key) {
      throw new Error('password changed');
    }

    const newAccessToken = genAccessToken(userInDb);
    response.status(200).json({ newAccessToken });
  } catch (error) {
    response.status(401).json({error: error.message});
  }
}
async function getUser (request, response) {
  const userInfo = response.locals.user;
  response.status(200).json({userInfo});
}

module.exports = {
  register,
  login,
  refreshToken,
  getUser
}

