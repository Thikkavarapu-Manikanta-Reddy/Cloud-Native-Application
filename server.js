const app = require('./index');
const dotenv= require('dotenv');
dotenv.config()
const port = process.env.PORT || 8080;
const createDb = require('./config/createDb')
const logger = require('./util/logger')

createDb().then(()=>{
  
  const sequelize = require('./models/index');
  sequelize.sync({alter: true}).then(() => {
    console.log('Database synced!');
  
    app.listen(port, async() => {
      logger.info(`App is running on port:${port}`)
      console.log(`Server running at http://localhost:${port}`);
    });
  }).catch((error) => {
    logger.error("App not running")
    console.error('Unable to sync database:', error);
    return error
  });
})
.catch((err)=>{
  logger.error("App not running")+
  console.log(err);
  process.exit(1);
})