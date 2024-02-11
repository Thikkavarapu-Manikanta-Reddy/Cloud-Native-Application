const app = require('./app');
const { sequelize } = require('./models');
require('dotenv').config();

const PORT = process.env.APP_PORT || 8081

async function main() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
    await sequelize.sync({force: true})
    
}

app.listen(PORT, () => {
    main();
    console.log(`App started on port: ${PORT}`)
});