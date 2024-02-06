const mysql = require('mysql2');

const dbPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Godofwar@321',
    database: 'sys',
  });
  
  // Function to check the database connection
  function checkDbConnection(callback) {
    dbPool.getConnection((err, connection) => {
      if (err) {
        return callback(err, null);
      }
  
      connection.release();
      callback(null, true);
    });
  }

  module.exports = {
    checkDbConnection
  }