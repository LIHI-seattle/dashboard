var mysql = require('mysql');
var fs = require('fs');
var readline = require('readline');

var myCon = mysql.createConnection({
	host: "lihi-test-db.mysql.database.azure.com", 
	user: "lihi_test_admin@lihi-test-db", 
	password: 'Impact++', 
	database: 'LIHI',
	port: 3306
});

// Drops database to be created again after change to SQL schema
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