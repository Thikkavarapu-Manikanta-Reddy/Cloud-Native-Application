const db = require('./mydb.js');

const express = require('express');
const app = express();



// Middleware to handle only GET requests
app.get('/healthz', (req, res) => {
  db.checkDbConnection((err, isConnected) => {
    if (err || !isConnected) {
      res
        .status(503)
        .header('Cache-Control', 'no-cache, no-store, must-revalidate')
        .json();
    } else {
      res
        .status(200)
        .header('Cache-Control', 'no-cache, no-store, must-revalidate')
        .json();
    }
  });
});

// Middleware to handle all other methods with a 405 response
app.all('/healthz', (req, res) => {
  res
    .status(405)
    .header('Cache-Control', 'no-cache, no-store, must-revalidate')
    .json();
});

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
