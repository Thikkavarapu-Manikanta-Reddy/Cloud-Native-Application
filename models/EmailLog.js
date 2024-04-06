const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const EmailLog = sequelize.define('EmailLog', {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    email_sent:{
        type:DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
  });

  module.exports=EmailLog