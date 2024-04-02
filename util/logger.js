const winston = require('winston');
const logFilePath = process.env.NODE_ENV === 'test' ? './log/application.log' : '/var/log/webapp/application.log';
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format((info) => {
      const map_values={
        error: "ERROR",
        warn: "WARNING",
        info: "INFO",
        debug: "DEBUG"
      };
      info.type="webapp";
      info.severity = map_values[info.level];
      return info;
    })(),
  ),
  transports: [
    new winston.transports.Console({ level: 'error' }),
    new winston.transports.File({ filename: logFilePath, format: winston.format.json()}),
      ]
});

logger.on('error', (err) => {
  console.error('Winston encountered an error:', err);
});

module.exports=logger