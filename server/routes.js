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
	


module.exports = app;
