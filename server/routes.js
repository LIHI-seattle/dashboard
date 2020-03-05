"use strict";
var mysql = require("mysql");
var express = require("express");
var app = express();

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "password",
	database: 'LIHI'	
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
	.get((req, res) => {
		res.locals.connection.query('SELECT * FROM PEOPLE', function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})
	// Get a person
	// Update a person

app.route("/residents")
	// Create a new resident
	.post((req, res) => {
		res.locals.connection.query('INSERT INTO RESIDENTS SET PID = ?, ROOM = ?, START_DATE = ?, END_DATE = ?, IN_RESIDENCE = ?',[req.body.PID, req.body.ROOM, req.body.START_DATE, req.body.END_DATE, req.body.IN_RESIDENCE], function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})
	// Get all residents
	.get((req, res) => {
		res.locals.connection.query('SELECT * FROM RESIDENTS', function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})
	// Update a resident
	.put((req, res) => {
		res.locals.connection.query('UPDATE RESIDENTS SET ROOM = ?, START_DATE = ?, END_DATE = ?, IN_RESIDENCE = ?', [req.body.ROOM, req.body.START_DATE, req.body.END_DATE, req.body.IN_RESIDENCE], function (error, results) {
			if(error) throw error;
	                res.send(JSON.stringify(results));
		});
	})


app.route("/permissions")
	// Get all permissions
	.get((req, res) => {
		res.locals.connection.query('SELECT * FROM PERMISSIONS', function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})

app.route("/rooms")
	// Get all rooms
	.get((req, res) => {
		res.locals.connection.query('SELECT * FROM ROOMS', function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})

app.route("/villages")
	// Get all villages
	.get((req, res) => {
		res.locals.connection.query('SELECT * FROM VILLAGES', function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})

module.exports = app;
