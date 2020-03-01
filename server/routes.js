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
	


module.exports = app;
