"use strict";
const express = require("express");
const mysql = require("mysql");
const app = express();
const routes = require("./routes");


try {
	app.use(express.json());
	app.use(routes);
	// app.use(cors());

	app.listen(process.env.PORT || 4000, () => {
		console.log("server is listening on port 4000");
	});

} catch (err) {
	console.log(err);
}


