"use strict";
const express = require("express");
const mysql = require("mysql");
const app = express();

app.listen(3000, () => {
	console.log("server is listening on port 3000");
});

//preliminary connection settings
const connection = mysql.createConnection( {
	HOST: "localhost",
	USER: "root",
	PASSWORD: "TBD",
	DATABASE: "LIHI"
});

// Resident Routes

// Creating new resident
app.post('/new', function(req, res, next) {
	res.locals.connection.query('INSERT INTO residents(PID, RoomID, StartDate, StillLiving, EndDate) values(''+req.body.PID+'',''+req.body.RoomID+'',''+req.body.StartDate+'',''+req.body.StillLiving+'',''+req.body.EndDate+'')', function (error, results, fields) {
		if(error) throw error;
		res.send(JSON.stringify(results));
	});
});

// Read all residents
app.get('/allRes', function(req, res, next) {
	res.locals.connection.query('SELECT * FROM residents', function (error, results, fields) {
		if(error) throw error;
		res.send(JSON.stringify(results));
	});
});

// Read singular resident based on ResID
app.get('/singRes', function(req, res, next) {
	res.locals.connection.query('SELECT * FROM residents WHERE id = ''+req.body.ResID+''', function (error, results, fields) {
		if(error) throw error;
		res.send(JSON.stringify(results));
	});
});

// Update resident
app.put('/editRes', function(req, res, next) {
	res.locals.connection.query('UPDATE customers SET RoomID = ''+req.body.RoomID+'', StillLiving = ''+req.body.StillLiving+'', EndDate = ''+req.body.EndDate+'' WHERE id = ''+req.body.ResID+''', function (error, results, fields) {
		if(error) throw error;
		res.send(JSON.stringify(results));
	});
});
