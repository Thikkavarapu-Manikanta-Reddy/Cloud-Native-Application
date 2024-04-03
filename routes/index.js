const {checkMethodType, checkUserMethod} = require('../middleware/checkMethod');
const checkBody = require('../middleware/checkBody');
const healthzRoute = require('./healthz')
const userRoutes = require('./user_routes');
const checkParams = require('../middleware/checkParams');

function routePaths(app){
  app.use('/healthz',checkParams, checkMethodType, checkBody, healthzRoute)
  app.use('/v1/user', checkUserMethod, userRoutes)
  app.use((req,res)=>{
    return res.status(404).json().send();
  })

}

module.exports = routePaths;