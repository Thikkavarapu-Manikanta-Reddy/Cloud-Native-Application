const winston = require( 'winston');
 
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: process.env.NODE_ENV === 'development' ? './log/application.log' : '/var/log/webapp/application.log' })
  ]
});
 
module.exports = logger;