/* eslint no-use-before-define: 0 */

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { sequelize } = require('./models')
const config = require('./config/config')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

require('./routes')(app)

sequelize.sync()
  .then(() => {
    app.listen(config.port || 8081)
    console.log(`Server started on port ${config.port}`)
  })
