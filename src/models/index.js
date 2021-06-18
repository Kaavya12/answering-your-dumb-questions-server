const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/config')
const JsonField = require('sequelize-json')
const db = {}

const DataTypes = Sequelize.DataTypes
const sequelize = new Sequelize("postgres://kikzgghn:lkHCqz9YHP5K3ovLxLN_rv0Hci_62wae@dumbo.db.elephantsql.com/kikzgghn");
/*
  config.db.database,
  config.db.user,
  config.db.password,
  config.db.options
);

fs
  .readdirSync(__dirname)
  .filter((file) => file !== 'index.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })
*/

(async () => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING
  })
  
  
  const Question = sequelize.define('Question', {
    question: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    answer: JsonField(db, 'Question', 'answer'),
    categories: DataTypes.ARRAY(DataTypes.STRING)
  })

  User.hasMany(Question);
  Question.belongsTo(User);

  models = [User, Question]
  models.forEach(model => {
    db[model.name] = model
  })

})()


db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
