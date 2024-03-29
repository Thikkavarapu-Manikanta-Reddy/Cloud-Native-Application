'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmailLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmailLog.init({
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
    sequelize,
    modelName: 'EmailLog',
    timestamps: false
  }
  );

  return EmailLog;
};

