"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        required: true,
        unique: {
          msg: "Username should be unique",
          fields: ["username"],
        },
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: "User name should be a valid email address!",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        required: true,
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verifyCode: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,
      createdAt: "account_created",
      updatedAt: "account_updated",
    }
  );
  // User.addHook('beforeCreate', (user, options) => {
  //   const salt = await bcrypt.genSalt(10);
  //   const hashedPassword = await bcrypt.hash( req.body.password , salt)
  //   user.password = hashPassword(user.password);
  // });

  // User.addHook('beforeUpdate', (user, options) => {
  //   const salt = await bcrypt.genSalt(10);
  //   const hashedPassword = await bcrypt.hash( req.body.password , salt)
  //   user.password = hashPassword(user.password);
  // });

  return User;
};
