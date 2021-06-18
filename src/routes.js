const AuthenticationController = require('./controllers/AuthenticationController')
const QuestionController = require('./controllers/QuestionController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
var jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.SECRET_KEY;

function authenticationMiddleware(request, response, nextHandler) {
  const accessToken = request.headers.authorization;

  try {
    const tokenPayload = jwt.verify(accessToken, JWT_SECRET_KEY);
    if (tokenPayload.type !== 'access') throw new Error('wrong token type');
    response.locals.user = tokenPayload;
    nextHandler();
  } catch (error) {
    response.status(401).send(error.message);
  }
}

module.exports = (app) => {
  app.post('/register', AuthenticationControllerPolicy.register, AuthenticationController.register),
  app.post('/login', AuthenticationController.login),
  app.post('/auth/token', AuthenticationController.refreshToken),
  app.post('/question', authenticationMiddleware, QuestionController.newQuestion )
  app.get('/getUser', authenticationMiddleware, AuthenticationController.getUser );
}
