// import HealthRoute from './healthRoute.js';
const HealthRoute = require('./healthRoute.js')
const UserRoute = require('./userRoutes.js')
// import UserRoute from './userRoutes.js'

const mainRouter = (app) => { 
    app.use("/healthz", HealthRoute);
    app.use("/v1/user", UserRoute);
}

// export default mainRouter;
module.exports = mainRouter;