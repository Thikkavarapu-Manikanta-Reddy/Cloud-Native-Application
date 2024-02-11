const express = require('express')
const routes = require('./routes')
const {sequelize} = require('./models');



const app = express()


// TODO: Check on App logging
// TODO: Check if you can containerize application

app.use(express.json());

routes(app);

// app.listen(PORT, () => {
//     main();
//     console.log(`App started on port: ${PORT}`)
// });


module.exports = app;