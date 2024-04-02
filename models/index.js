const dbSetup = require('../config/db.config')
const Sequelize = require('sequelize')

const sequelize = new Sequelize(dbSetup.DATABASE, dbSetup.USER, dbSetup.PASSWORD, {
    host: dbSetup.HOST,
    dialect: dbSetup.DIALECT
  });

module.exports=sequelize;
