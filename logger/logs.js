const winston = require( 'winston');
 
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './log/application.log' })
  ]
});

if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({ filename: '/var/log/webapp/application.log' }));
}
 
module.exports = logger;