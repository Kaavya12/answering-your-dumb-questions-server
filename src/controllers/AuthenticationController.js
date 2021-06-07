const { User } = require('../models')

module.exports = {
  async register (req, res) {
    try {
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
}
