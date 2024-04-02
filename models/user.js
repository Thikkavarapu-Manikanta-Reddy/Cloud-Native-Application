/**
 * Reference docs: 
 * https://sequelize.org/docs/v6/core-concepts/model-basics/
 * https://stackoverflow.com/questions/14653913/rename-node-js-sequelize-timestamp-columns
 */
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    verifyCode:{
        type: DataTypes.STRING
    }
}, {
    createdAt: 'account_created',
    updatedAt: 'account_updated'
});

module.exports = User;