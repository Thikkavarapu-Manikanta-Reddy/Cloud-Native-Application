const sequelize = require('../models/index')
const express = require('express');
const router = express.Router();
const checkDbconnection = require('../middleware/checkDbconnection')

router.route('/').get(checkDbconnection);

module.exports=router