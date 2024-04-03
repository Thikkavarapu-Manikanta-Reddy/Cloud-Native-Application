const dbSetup = require('./db.config');
const { Sequelize } = require('sequelize');
const logger = require('../util/logger');
async function createDb() {
    const sequelize = new Sequelize('', dbSetup.USER, dbSetup.PASSWORD, {
        host: dbSetup.HOST,
        dialect: 'mysql'
    });

    try {

        await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbSetup.DATABASE}\`;`);
        console.log(`Database ${dbSetup.DATABASE} is ready.`);
    } catch (error) {

        console.error('Unable to create the database:', error);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

module.exports=createDb