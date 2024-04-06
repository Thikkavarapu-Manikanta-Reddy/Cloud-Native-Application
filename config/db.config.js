const dotenv= require('dotenv');
dotenv.config();
//Reference used: https://sequelize.org/docs/v6/getting-started/
module.exports = {
    HOST: process.env.DB_HOSTNAME,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DB_NAME,
    DIALECT: 'mysql'
}