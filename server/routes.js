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


class Database {
    constructor( config ) {
        this.connection = mysql.createConnection({
			host: "lihi-test-db.mysql.database.azure.com", 
			user: "lihi_test_admin@lihi-test-db", 
			password: 'Impact++', 
			database: 'LIHI',
			port: 3306
		});
		this.connection.connect(function(err) {
			if (err) throw err;
			console.log("Connected!");
	   });
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            });
        });
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
	}
}

// 	host: "localhost",
// 	user: "root",
// 	password: "password",
// 	database: 'LIHI'

var con = new Database();

app.route("/people")
	.get((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', 'lihi-test-db.mysql.database.azure.com');
		con.query('SELECT * FROM PEOPLE')
			.then(rows => {
				res.send(JSON.stringify(rows))
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
			});
	})

	// Create a new person
	.post((req, res) => {
		con.query('INSERT INTO PEOPLE (FIRST_NAME, LAST_NAME, BIRTHDAY, ROLE_ID, VID) VALUES (?, ?, ?, ?, ?)' ,[req.body.fName, req.body.lName, req.body.birthday, req.body.RoleID, req.body.VID])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
			});	
	})

	// Update a person
	.put((req, res) => {
		con.query('UPDATE PEOPLE SET FIRST_NAME = ?, LAST_NAME = ?, BIRTHDAY = ?, ROLE_ID = ?, VID = ? WHERE PID = ?', [req.body.fName, req.body.lName, req.body.birthday, req.body.RoleID, req.body.VID, req.body.PID])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
		});	
	})

	// Delete person
	.delete((req, res) => {
		con.query('DELETE FROM PEOPLE WHERE PID = ?', [req.body.PID])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
		});	
	})


app.route("/residents")
	// Get all residents
	.get((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', 'lihi-test-db.mysql.database.azure.com');
		con.query('SELECT * FROM RESIDENTS')
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
			});	
	})

	// Create a new resident
	.post((req, res) => {
		let newRes = JSON.parse(req.body);
		con.query('SELECT * FROM PEOPLE WHERE FIRST_NAME = ? AND LAST_NAME = ? AND BIRTHDAY = ?', [newRes.fName, newRes.lName, newRes.birthday])
			.then(rows => {
				var results = rows;
				if (results.length < 1) {
					return con.query('SELECT VID FROM VILLAGES WHERE NAME = ?', newRes.village);
				} else {
					con.query('INSERT INTO RESIDENTS (PID, ROOM_ID, START_DATE, END_DATE, IN_RESIDENCE) VALUES (?, ?, ?, ?, ?) ',[results[0].PID, newRes.room, req.body.StartDate, null, true]) 
					throw new Error('Insert resident'); 
				}
			}, err => { 	
				return con.close().then( () => { throw err; } )
			})
			.then(rows => {
				var vResults = rows;
				if (vResults.length >= 1 ) {
					return con.query('INSERT INTO PEOPLE (FIRST_NAME, LAST_NAME, BIRTHDAY, ROLE_ID, VID) VALUES (?, ?, ?, ?, ?)', [newRes.fName, newRes.lName, newRes.birthday, 1, vResults[0].VID])
				}
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.then(rows => {
				var pResults = rows;
				con.query('INSERT INTO RESIDENTS (PID, ROOM_ID, START_DATE, END_DATE, IN_RESIDENCE) VALUES (?, ?, ?, ?, ?) ',[pResults.insertId, newRes.room, req.body.StartDate, null, true])
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.then( () => {
				res.status(201).send(JSON.stringify(results));
			})
			.catch( err => {
				if (err.message == 'Insert resident') {
					res.sendStatus(200);				
				} else {
					res.sendStatus(400);
				}
			});	

	})

	// Update a resident
	.put((req, res) => {
		con.query('UPDATE RESIDENTS SET PID = ?, ROOM_ID = ?, START_DATE = ?, END_DATE = ?, IN_RESIDENCE = ? WHERE RID = ?', [req.body.PID, req.body.RoomID, req.body.StartDate, req.body.EndDate, req.body.InResidence, req.body.RID])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
			});	
	})

	// Delete resident (add end date and change residence status)
	.delete((req, res) => {
		let delRes = JSON.parse(req.body);

		con.query('SELECT * FROM PEOPLE WHERE FIRST_NAME = ? AND LAST_NAME = ? AND BIRTHDAY = ?', [delRes.fName, delRes.lName, delRes.birthday])
			.then(rows => {
				if (rows.length == 1) {
					return rows[0];
				} else {
					throw new Error('No resident found')
				}
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.then(row => {
				return con.query('UPDATE RESIDENTS SET END_DATE = ? AND IN_RESIDENCE = False WHERE PID = ? AND IN_RESIDENCE = TRUE', [delRes.endDate, row.PID])
			})
			.then(rows => {
				res.sendStatus(200);
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
			});	
	})
	


app.route("/permissions")
	// Get all permissions
	.get((req, res) => {
		con.query('SELECT * FROM PERMISSIONS')
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
		});	
	})

	// Create a new permission
	.post((req, res) => {
		con.query('INSERT INTO PERMISSIONS (DESCRIPTION) VALUES (?) ', [req.body.Description])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
		});	
	})

	// Update a permission
	.put((req, res) => {
		con.query('UPDATE PERMISSIONS SET DESCRIPTION = ? WHERE ROLE_ID = ?', [req.body.Description, req.body.RoleID])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
		});	
	})

	// Delete permission
	.delete((req, res) => {
		con.query('DELETE FROM PERMISSIONS WHERE ROLE_ID = ?', [req.body.RoleID])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
		});	
	})
	


app.route("/rooms")
	// Get all rooms
	.get((req, res) => {
		con.query('SELECT * FROM ROOMS')
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
		});	
	})

	// Create a new room
	.post((req, res) => {
		con.query('INSERT INTO ROOMS (ROOM_NUM, BLDG_NAME, VID, VACANT) VALUES (?, ?, ?, ?)', [req.body.RoomNum, req.body.BldgName, req.body.VID, req.body.Vacant])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
		});	
	})

	// Update a room
	.put((req, res) => {
		con.query('UPDATE ROOMS SET ROOM_NUM = ?, BLDG_NAME = ?, VID = ?, VACANT = ? WHERE ROOM_ID = ?', [req.body.RoomNum, req.body.BuildingName, req.body.VID, req.body,vacant, req.body.RoomID])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
		});	
	})

	// Delete a room
	.delete((req, res) => {
		con.query('DELETE FROM ROOMS WHERE ROOM_ID = ?', [req.body.RoomID])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
		});	
	})

app.route("/villages")
	// Get all villages
	.get((req, res) => {
		con.query('SELECT * FROM VILLAGES')
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
		});	
	})

	// Create a new village
	.post((req, res) => {
		con.query('INSERT INTO VILLAGES (NAME) VALUES (?) ', [req.body.Name])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
		});	
	})

	// Update a village
	.put((req, res) => {
		con.query('UPDATE VILLAGES SET NAME = ? WHERE VID = ?', [req.body.Name, req.body.VillageID])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
		});	
	})

	// Delete a village
	.delete((req, res) => {
		con.query('DELETE FROM VILLAGES WHERE VID = ?', [req.body.VillageID],)
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				// handle the error
		});	
	})

module.exports = app;
