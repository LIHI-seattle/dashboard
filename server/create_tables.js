var mysql = require('mysql');
var fs = require('fs');
var readline = require('readline');
const {
    serverHost, serverUser, serverPassword,
    serverDatabase, serverPort
} = require('./common')

const dbConfig = {
        host: serverHost,
        user: serverUser,
        password: serverPassword,
        database: serverDatabase,
        port: serverPort
    };

var myCon = mysql.createConnection(dbConfig);

// Drops database to be created again after change to SQL schema
// var myCon = mysql.createConnection({
// 	host: "localhost",
// 	user: "root",
// 	password: "password",
// 	database: 'LIHI'
// });
// myCon.query("DROP DATABASE IF EXISTS LIHI;", function (err, result) {
// 	if (err) throw err;
// 	console.log("Database deleted");
// });

myCon.query("CREATE DATABASE IF NOT EXISTS LIHI", function (err, result) {
			if (err) throw err;
			console.log("Database created");
		});
var rl = readline.createInterface({
	input: fs.createReadStream('./tables.sql'),
	terminal: false
	});
rl.on('line', function(chunk){
		myCon.query(chunk.toString('ascii'), function(err, sets, fields){
				if(err) console.log(err);
				});
});
rl.on('close', function(){
	console.log("finished");
	myCon.end();
});