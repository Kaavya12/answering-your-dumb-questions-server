const { User } = require('../models')
const bcrypt = require('bcrypt');

module.exports = {
  async register (req, res) {
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
  },
  async login (req, res) {
    const body = req.body;
    const user = await User.findOne({where: { username: body.username }});
    if (user) {
      const validPassword = await bcrypt.compare(body.password, user.password);
      if (validPassword) {
        res.status(200).json({ message: "Valid password" });
      } else {
        res.status(400).json({ error: "Invalid Password" });
      }
    } else {
      res.status(401).json({ error: "User does not exist" });
    }
  }
}
