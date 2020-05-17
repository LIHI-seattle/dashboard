"use strict";
var mysql = require("mysql");
var express = require("express");
var app = express();

const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
  })
  
readline.question(`What's your name?`, (pwd) => {
console.log(`Enter MySQL password: ${pwd}!`)
readline.close()
})


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

	// Create a new person
	.post((req, res) => {
		con.query('INSERT INTO PEOPLE (FIRST_NAME, LAST_NAME, BIRTHDAY, ROLE_ID, VID) VALUES (?, ?, ?, ?, ?)' ,[req.body.fName, req.body.lName, req.body.birthday, req.body.RoleID, req.body.VID], function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})

	// Update a person
	.put((req, res) => {
		con.query('UPDATE PEOPLE SET FIRST_NAME = ?, LAST_NAME = ?, BIRTHDAY = ?, ROLE_ID = ?, VID = ? WHERE PID = ?', [req.body.fName, req.body.lName, req.body.birthday, req.body.RoleID, req.body.VID, req.body.PID], function (error, results) {
			if(error) throw error;
					res.send(JSON.stringify(results));
		});
	})

	// Delete person
	.delete((req, res) => {
		con.query('DELETE FROM PEOPLE WHERE PID = ?', [req.body.PID], function (error, results) {
			if(error) throw error;
					res.send(JSON.stringify(results));
		});
	})


app.route("/residents")
	// Get all residents
	.get((req, res) => {
		con.query('SELECT * FROM RESIDENTS', function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})

	// Create a new resident
	.post((req, res) => {
		let newRes = JSON.parse(req.body);
		con.query('SELECT * FROM PEOPLE WHERE FIRST_NAME = ? AND LAST_NAME = ? AND BIRTHDAY = ?', [newRes.fName, newRes.lName, newRes.birthday], function (error, results) {
			if(error) throw error;
			if (results.length < 1) {
				con.query('SELECT VID FROM VILLAGES WHERE NAME = ?', newRes.village, function(error, vResults) {
					if (error) throw error;
					if (results.length >= 1) {
						con.query('INSERT INTO PEOPLE (FIRST_NAME, LAST_NAME, BIRTHDAY, ROLE_ID, VID) VALUES (?, ?, ?, ?, ?)', [newRes.fName, newRes.lName, newRes.birthday, 1, vResults[0].VID], function(error, pResults) {
							if(error) throw error;
							con.query('INSERT INTO RESIDENTS (PID, ROOM_ID, START_DATE, END_DATE, IN_RESIDENCE) VALUES (?, ?, ?, ?, ?) ',[pResults.insertId, newRes.room, req.body.StartDate, null, true], function (error, rResults) {
								if(error) throw error;
								res.send(JSON.stringify(results));
							});
						});
					}
				})
			} else {
				con.query('INSERT INTO RESIDENTS (PID, ROOM_ID, START_DATE, END_DATE, IN_RESIDENCE) VALUES (?, ?, ?, ?, ?) ',[results[0].PID, newRes.room, req.body.StartDate, null, true], function (error, results) {
					if(error) throw error;
					res.send(JSON.stringify(results));
				});
			}
		});
	})

	// Update a resident
	.put((req, res) => {
		con.query('UPDATE RESIDENTS SET PID = ?, ROOM_ID = ?, START_DATE = ?, END_DATE = ?, IN_RESIDENCE = ? WHERE RID = ?', [req.body.PID, req.body.RoomID, req.body.StartDate, req.body.EndDate, req.body.InResidence, req.body.RID], function (error, results) {
			if(error) throw error;
					res.send(JSON.stringify(results));
		});
	})

	// Delete resident
	.delete((req, res) => {
		con.query('DELETE FROM RESIDENTS WHERE RID = ?', [req.body.RID], function (error, results) {
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

	// Create a new permission
	.post((req, res) => {
		con.query('INSERT INTO PERMISSIONS (DESCRIPTION) VALUES (?) ', [req.body.Description], function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})

	// Update a permission
	.put((req, res) => {
		con.query('UPDATE PERMISSIONS SET DESCRIPTION = ? WHERE ROLE_ID = ?', [req.body.Description, req.body.RoleID], function (error, results) {
			if(error) throw error;
					res.send(JSON.stringify(results));
		});
	})

	// Delete permission
	.delete((req, res) => {
		con.query('DELETE FROM PERMISSIONS WHERE ROLE_ID = ?', [req.body.RoleID], function (error, results) {
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

	// Create a new room
	.post((req, res) => {
		con.query('INSERT INTO ROOMS (ROOM_NUM, BLDG_NAME, VID, VACANT) VALUES (?, ?, ?, ?)', [req.body.RoomNum, req.body.BldgName, req.body.VID, req.body.Vacant], function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})

	// Update a room
	.put((req, res) => {
		con.query('UPDATE ROOMS SET ROOM_NUM = ?, BLDG_NAME = ?, VID = ?, VACANT = ? WHERE ROOM_ID = ?', [req.body.RoomNum, req.body.BuildingName, req.body.VID, req.body,vacant, req.body.RoomID], function (error, results) {
			if(error) throw error;
					res.send(JSON.stringify(results));
		});
	})

	// Delete a room
	.delete((req, res) => {
		con.query('DELETE FROM ROOMS WHERE ROOM_ID = ?', [req.body.RoomID], function (error, results) {
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

	// Create a new village
	.post((req, res) => {
		con.query('INSERT INTO VILLAGES (NAME) VALUES (?) ', [req.body.Name], function (error, results) {
			if(error) throw error;
			res.send(JSON.stringify(results));
		});
	})

	// Update a village
	.put((req, res) => {
		con.query('UPDATE VILLAGES SET NAME = ? WHERE VID = ?', [req.body.Name, req.body.VillageID], function (error, results) {
			if(error) throw error;
					res.send(JSON.stringify(results));
		});
	})

	// Delete a village
	.delete((req, res) => {
		con.query('DELETE FROM VILLAGES WHERE VID = ?', [req.body.VillageID], function (error, results) {
			if(error) throw error;
					res.send(JSON.stringify(results));
		});
	})

module.exports = app;
