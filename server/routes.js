"use strict";
var mysql = require("mysql");
var express = require("express");
var app = express();

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "password",
	database: 'lihi'	
});

con.connect(function(err) {
 	if (err) throw err;
 	console.log("Connected!");
	let createTodos = `CREATE TABLE PEOPLE(
                          PID INT PRIMARY KEY AUTO_INCREMENT,
                          NAME VARCHAR(255) NOT NULL,
                          ROLE INT NOT NULL
                      )`;
 
 	con.query(createTodos, function(err, results, fields) {
  		if (err) {
    		console.log(err.message);
    	}
 	});
});

app.route("/people")
	// Create a new person
	.post((req, res) => {


	})
	// Get a person
	// Update a person

app.route("/residents")
	// Create a new resident
	.post((req, res) => {
		res.locals.connection.query('INSERT INTO residents SET PID = ?, RoomID = ?, StartDate = ?, StillLiving = ?, EndDate = ?',[req.body.PID, req.body.RoomID, req.body.StartDate, req.boyd.StillLiving, req.body.EndDate], function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})
	// Get all residents
	.get((req, res) => {
		res.locals.connection.query('SELECT * FROM residents', function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})
	// Update a resident
	.put((req, res) => {
		res.locals.connection.query('UPDATE customers SET RoomID = ?, StartDate = ?, StillLiving = ?, EndDate = ?', [req.body.RoomID, req.body.StartDate, req.body.StillLiving, req.body.EndDate], function (error, results) {
			if(error) throw error;
	                res.send(JSON.stringify(results));
		});
	})

module.exports = app;
