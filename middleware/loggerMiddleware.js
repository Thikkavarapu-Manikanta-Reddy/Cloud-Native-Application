const logger = require('../util/logger')
  
function hideSensitiveData(body) {
  const reqBody = { ...body };

  if (reqBody.password) {
    delete reqBody.password;
  }

  return reqBody;
}

const loggingMiddleware = async(req, res, next) =>{
  const startTime = new Date();
  const sanitizedBody = hideSensitiveData(req.body);

  // Logging the incoming request
  logger.info({
      message: `Incoming ${req.method} request for ${req.path}`,
      method: req.method,
      path: req.path,
      body: sanitizedBody
  });

  // Logging the response after it's sent
  res.on('finish', () => {
      const duration = new Date() - startTime;
      const { statusCode } = res;
      let level;
      if (statusCode >= 500) {
          level = 'error';
      } else if(statusCode>=400){
        level='warn'
      }
        else {
          level = 'info';
      }
      logger.log({
          level,
          message: `Outgoing response for ${req.method} request path: ${req.path}`,
          method: req.method,
          path: req.path,
          body: hideSensitiveData(res.body),
          status: statusCode,
          duration: `${duration}ms`
      });
  });

  next();
}
  
  module.exports =  loggingMiddleware;