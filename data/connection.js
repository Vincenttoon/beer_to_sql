const mysql = require('mysql2');

// creates connection to local host through mysql and accesses the database
const connection = mysql.createConnection({
    host: "localhost",
    // Your MySQL username,
    user: "root",
    // Your MySQL password
    password: "testy",
    database: "vinny_beers_db",
  });
  
  // exports connection info for data/index usage
  module.exports = connection;