require('dotenv').config();

DB_DIALECT = 'mysql';

module.exports = {
    development: {
        username: process.env.DB_USER || 'root' ,
        password: process.env.DB_PASSWORD || 'Godofwar@321',
        database: process.env.DB_NAME || 'sys',
        host: process.env.DB_HOSTNAME || 'localhost',
        dialect: DB_DIALECT,
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        dialect: DB_DIALECT,
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        dialect: DB_DIALECT,
    },
};