let mysql = require('mysql');
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'RootUser00',
  database: 'LIHI'
});
 
// connect to the MySQL server
connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
 
  let createTodos = `CREATE TABLE PEOPLE(
                          PID INT PRIMARY KEY AUTO_INCREMENT,
                          NAME VARCHAR(255) NOT NULL,
                          ROLE INT NOT NULL
                      )`;
 
  connection.query(createTodos, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });
 
  connection.end(function(err) {
    if (err) {
      return console.log(err.message);
    }
  });
});