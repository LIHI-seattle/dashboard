"use strict";
var mysql = require("mysql");
var express = require("express");
var app = express();

var con = mysql.createConnection({
	host: "localhost",
	user: "username",
	password: "password"
	
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
		res.locals.connection.query('INSERT INTO residents(PID, RoomID, StartDate, StillLiving, EndDate) values(''+req.body.PID+'',''+req.body.RoomID+'',''+req.body.StartDate+'',''+req.body.StillLiving+'',''+req.body.EndDate+'')', function (error, results, fields) {
			if(error) throw error;
			res.send(JSON.stringify(resuults));
		});
	})
	.get((req, res) => {
		res.locals.connection.query('SELECT * FROM residents', function (error, results, fields) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})
	.put((req, res) => {
		res.locals.connection.query('UPDATE customers SET RoomID = ''+req.body.RoomID+'', StillLiving = ''+req.body.StillLiving+'', EndDate = ''+req.body.EndDate+'' WHERE id = ''+req.body.ResID+''', function (error, results, fields) {
			if(error) throw error;
	                res.send(JSON.stringify(results));
		});
	})

module.exports = app;
