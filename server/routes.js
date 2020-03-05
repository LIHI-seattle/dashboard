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
});

app.route("/people")
	.get((req, res) => {
		con.query('SELECT * FROM PEOPLE', function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})
	// Get a person
	// Update a person

app.route("/residents")
	// Create a new resident
	.post((req, res) => {
		con.query('INSERT INTO RESIDENTS SET PID = ?, ROOM = ?, START_DATE = ?, END_DATE = ?, IN_RESIDENCE = ?',[req.body.PID, req.body.ROOM, req.body.START_DATE, req.body.END_DATE, req.body.IN_RESIDENCE], function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})
	// Get all residents
	.get((req, res) => {
		con.query('SELECT * FROM RESIDENTS', function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})
	// Update a resident
	.put((req, res) => {
		con.query('UPDATE RESIDENTS SET ROOM = ?, START_DATE = ?, END_DATE = ?, IN_RESIDENCE = ? WHERE PID = ?', [req.body.ROOM, req.body.START_DATE, req.body.END_DATE, req.body.IN_RESIDENCE, req.body.PID], function (error, results) {
			if(error) throw error;
	                res.send(JSON.stringify(results));
		});
	})


app.route("/permissions")
	// Get all permissions
	.get((req, res) => {
		con.query('SELECT * FROM PERMISSIONS', function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})

app.route("/rooms")
	// Get all rooms
	.get((req, res) => {
		con.query('SELECT * FROM ROOMS', function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})

app.route("/villages")
	// Get all villages
	.get((req, res) => {
		con.query('SELECT * FROM VILLAGES', function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})

module.exports = app;
