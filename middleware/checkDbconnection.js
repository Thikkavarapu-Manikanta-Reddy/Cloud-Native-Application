const sequelize = require('../models/index');
const logger = require('../util/logger');

function checkDbconnection(req,res,next){
    sequelize.authenticate().then(() => {
        logger.info("Database connection is successful")
        console.log('Database connected.')
        return res.status(200).json().send();
      })
      .catch((err)=> {
        logger.error("Database connection Failed")
        return res.status(503).json().send();
      })
}

module.exports=checkDbconnection