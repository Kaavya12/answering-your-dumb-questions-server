/* eslint-disable */

const Joi = require('@hapi/joi')
module.exports = {
  register (req, res, next) {
    const schema = {
      email: Joi.string().email(),
      username: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{8,32}$')
      ), 
      password: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{8,32}$')
      ) 
    }

    const {error, value} = Joi.validate(req.body, schema)

    if (error) {
      switch (error.details[0].context.key){
          case 'email':
              res.status(400).send({
                error: 'Please provide a valid email address'
              })
            break
          case 'password':
            res.status(400).send({
              error: `Password provided failed to match the following rules:
                <br>
                1. It must contain ONLY the following characters: lower case, upper case, numbers
                <br>
                2. It must be atleast 8 characters in length and not greater than 32 characters in length
              `
            })
            break
          case 'username':
            res.status(400).send({
              error: `Username provided failed to match the following rules:
                <br>
                1. It must contain ONLY the following characters: lower case, upper case, numbers
                <br>
                2. It must be atleast 8 characters in length and not greater than 32 characters in length
              `
            })
            break
          default:
            res.status(400).send({
                error: 'Invalid registation information'
            })
            break
      }
    }
    else {
      next()
    }
  }
}