"use strict";
var mysql = require("mysql");
var express = require("express");
var app = express();
app.use(express.json());
const cors = require('cors');

var {serverHost, serverUser, serverPassword,
	 serverDatabase, serverPort, frontendHost} = require('./common')


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
			host: serverHost,
			user: serverUser, 
			password: serverPassword, 
			database: serverDatabase,
			port: serverPort
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

// Used for testing local db:
// host: "localhost",
// user: "root",
// password: "password",
// database: 'LIHI'

var con = new Database();

var corsOptions = {
	origin: frontendHost,
	optionsSuccessStatus: 200 
  }

app.options('*', cors(corsOptions));

app.route("/people")
	// .get((req, res) => {
	// 	con.query('SELECT * FROM PEOPLE', function (error, results) {
	// 		if(error) throw error;
	// 		res.send(JSON.stringify(results));
	// 	});
	// })
	.get((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', frontendHost);
		con.query('SELECT * FROM PEOPLE')
			.then(rows => {
				res.status(200).send(JSON.stringify(rows))
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
		res.setHeader('Access-Control-Allow-Origin', frontendHost);
		con.query('INSERT INTO PEOPLE (FIRST_NAME, LAST_NAME, BIRTHDAY, ROLE_ID, VID) VALUES (?, ?, ?, ?, ?)' ,[req.body.fName, req.body.lName, req.body.birthday, req.body.RoleID, req.body.VID])
			.then(rows => {
				res.status(201).send(JSON.stringify(rows));
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
		res.setHeader('Access-Control-Allow-Origin', frontendHost);
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
		res.setHeader('Access-Control-Allow-Origin', frontendHost);
		con.query('DELETE FROM PEOPLE WHERE PID = ?', [req.body.PID])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				return;
		});	
	})


app.route("/residents")
	// Get all residents
	.get((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', frontendHost);
		con.query('SELECT * FROM RESIDENTS JOIN PEOPLE ON RESIDENTS.PID = PEOPLE.PID WHERE RESIDENTS.IN_RESIDENCE = 1')
			.then(rows => {
				res.status(200).json(rows);
				return Promise.resolve(rows);
			}, err => {
				return con.close().then( () => { throw err; })
			})
			.catch( err => {
				res.status(400).send(err.message);
			});		
	})

	// Creates a new resident
	//   To add a new resident: Find village ID, then house ID, then person ID (create new person if they don't exist, verify residence if they do),
	// 	 then update information if needed, then insert into residents, then update vacancy, then return the new resident to the client. 
	.post((req, res) => {
		res.setHeader('Access-Control-Allow-Origin', frontendHost);
		let newRes = req.body;
		let villageResults, houseResults, personResults, personID, addedResident;
		res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
		newRes.employment = (newRes.employment == 'true');
		newRes.identification = (newRes.identification == 'true');
		newRes.disabilities = (newRes.disabilities == 'true');
		newRes.children = (newRes.children == 'true');
		newRes.criminalHistory = (newRes.criminalHistory == 'true');
		con.query('SELECT VID FROM VILLAGES WHERE NAME = ?', newRes.village)
			// Selects the house if the village is found. 
			.then(rows => {
				villageResults = rows;
				if (villageResults.length > 0) {
					return con.query('SELECT HOUSE_ID FROM HOUSES WHERE HOUSE_NUM = ? AND VID = ?', [newRes.house, villageResults[0].VID]);
				} else {
					return Promise.resolve().then( () => { throw new Error("Bad request: Village not found.");} )
				}
			}, err => {
				return Promise.resolve().then( () => { throw err; } )
			})
			// Selects the person if the house is found.
			.then(houseRows => {
				houseResults = houseRows;
				if (houseResults.length > 0) {
					if (houseResults[0].VACANT === 0) {
						return Promise.resolve().then( () => { throw new Error('Bad request: House not vacant'); } )
					}
					return con.query('SELECT PID FROM PEOPLE WHERE FIRST_NAME = ? AND LAST_NAME = ? AND BIRTHDAY = ?', [newRes.fName, newRes.lName, newRes.birthday]);
				} else {
					return Promise.resolve().then( () => { throw new Error('Bad request: House not found'); } )
				}
			}, err => {
				return Promise.resolve().then( () => { throw err; } )
			})
			// Inserts a new person into db if not found. Otherwise selects and verifies user is not currently residing in a house
			.then(pRows => {
				personResults = pRows;
				if (personResults.length < 1) {
					return con.query('INSERT INTO PEOPLE (FIRST_NAME, LAST_NAME, BIRTHDAY, ROLE_ID, VID, GENDER, EMPLOYMENT, IDENTIFICATION, PREVIOUS_RESIDENCE, DISABILITIES, CHILDREN, PREVIOUS_SHELTER_PROGRAM, CRIMINAL_HISTORY) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
						[newRes.fName, newRes.lName, newRes.birthday, 1, villageResults[0].VID, newRes.gender, newRes.employment, newRes.identification, newRes.pastResidence, newRes.disabilities, newRes.children, newRes.pastShelter, newRes.criminalHistory])
				} else {
					return con.query('SELECT IN_RESIDENCE FROM RESIDENTS WHERE PID = ?', personResults[0].PID);
				}
			}, err => {
				return Promise.resolve().then( () => { throw err; } )
			})
			// Returns the inserted row if the previous promise executed an insert, otherwise verifies that the person is not already a resident somewhere else (Users should only have one residence at any given time. This check is required to prevent a person from being added as a resident to more than one house). Then updates existing people information.
			// NOTE: No user information is updated if they are currently residing in a house
			.then(insChkResidenceRows => {
				if (insChkResidenceRows.insertId) {
					return Promise.resolve(insChkResidenceRows);
				} 

				for (var i = 0; i < insChkResidenceRows.length; i++) {
					if (insChkResidenceRows[i].IN_RESIDENCE === 1) {
						return Promise.resolve().then( () => { throw new Error('Bad request: Existing residence found'); } )
					}
				} 

				return con.query('UPDATE PEOPLE SET GENDER = ?, EMPLOYMENT = ?, IDENTIFICATION = ?, PREVIOUS_RESIDENCE = ?, DISABILITIES = ?, CHILDREN = ?, PREVIOUS_SHELTER_PROGRAM = ?, CRIMINAL_HISTORY = ? WHERE FIRST_NAME = ? AND LAST_NAME = ? AND BIRTHDAY = ?', 
					[newRes.gender, newRes.employment, newRes.identification, newRes.pastResidence, newRes.disabilities, newRes.children, newRes.pastShelter, newRes.criminalHistory, newRes.fName, newRes.lName, newRes.birthday]);
			}, err => {
				return Promise.resolve().then( () => { throw err; } )
			})
			// Sets the new person ID and inserts the new residence 
			.then(persResRows => {
				if (persResRows.insertId) {
					personID = persResRows.insertId;
				} else {
					personID = personResults[0].PID;
				}
				return con.query('INSERT INTO RESIDENTS (PID, HOUSE_ID, START_DATE, END_DATE, IN_RESIDENCE) VALUES (?, ?, ?, ?, ?) ',[personID, houseResults[0].HOUSE_ID, req.body.startDate, null, true]);
			}, err => {
				return Promise.resolve().then( () => { throw err; } )
			})
			// Select the newly added residence
			.then(insResRows => {
				return con.query('SELECT * FROM RESIDENTS WHERE RID = ?', insResRows.insertId);
			}, err => {
				return Promise.resolve().then( () => { throw err; } )
			})
			// Update vacancy of the house
			.then(newResident => {
				addedResident = newResident;
				return con.query('UPDATE HOUSES SET VACANT = FALSE WHERE HOUSE_ID = ?', houseResults[0].HOUSE_ID);
			}, err => {
				return Promise.resolve().then( () => { throw err; } )
			})
			// Return new resident
			.then(updatedVacancy => {
				res.status(201).json((addedResident[0]));
			}, err => {
				return Promise.resolve().then( () => { throw err; } )
			})
			.catch( err => {
				console.log("Error message: " + err.message);
				if (!err.message.includes("Bad request:")) {
					res.status(400).json({'error': "Bad request"});
				} else {
					res.status(400).json({'error': err.message});
				}
			});	

	})

	// Update a resident
	.put((req, res) => {
		res.setHeader('Access-Control-Allow-Origin', frontendHost);
		con.query('UPDATE RESIDENTS SET PID = ?, ROOM_ID = ?, START_DATE = ?, END_DATE = ?, IN_RESIDENCE = ? WHERE RID = ?', [req.body.PID, req.body.RoomID, req.body.StartDate, req.body.EndDate, req.body.InResidence, req.body.RID])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				return;
				// handle the error
			});	
	})

	// Delete resident (add end date and change residence status)
	.delete((req, res) => {
		res.setHeader('Access-Control-Allow-Origin', frontendHost);
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
				return;
				// handle the error
			});	
	})
	


app.route("/permissions")
	// Get all permissions
	.get((req, res) => {
		res.setHeader('Access-Control-Allow-Origin', frontendHost);
		con.query('SELECT * FROM PERMISSIONS')
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				return;
				// handle the error
		});	
	})

	// Create a new permission
	.post((req, res) => {
		res.setHeader('Access-Control-Allow-Origin', frontendHost);
		con.query('INSERT INTO PERMISSIONS (DESCRIPTION) VALUES (?) ', [req.body.Description])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				return;
				// handle the error
		});	
	})

	// Update a permission
	.put((req, res) => {
		res.setHeader('Access-Control-Allow-Origin', frontendHost);
		con.query('UPDATE PERMISSIONS SET DESCRIPTION = ? WHERE ROLE_ID = ?', [req.body.Description, req.body.RoleID])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				return;
				// handle the error
		});	
	})

	// Delete permission
	.delete((req, res) => {
		res.setHeader('Access-Control-Allow-Origin', frontendHost);
		con.query('DELETE FROM PERMISSIONS WHERE ROLE_ID = ?', [req.body.RoleID])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				return;
				// handle the error
		});	
	})
	


app.route("/rooms")
	// Get all rooms
	.get((req, res) => {
		res.setHeader('Access-Control-Allow-Origin', frontendHost);
		con.query('SELECT * FROM ROOMS')
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				return;
				// handle the error
		});	
	})

	// Create a new room
	.post((req, res) => {
		res.setHeader('Access-Control-Allow-Origin', frontendHost);
		con.query('INSERT INTO ROOMS (ROOM_NUM, BLDG_NAME, VID, VACANT) VALUES (?, ?, ?, ?)', [req.body.RoomNum, req.body.BldgName, req.body.VID, req.body.Vacant])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				return;
				// handle the error
		});	
	})

	// Update a room
	.put((req, res) => {
		res.setHeader('Access-Control-Allow-Origin', frontendHost);
		con.query('UPDATE ROOMS SET ROOM_NUM = ?, BLDG_NAME = ?, VID = ?, VACANT = ? WHERE ROOM_ID = ?', [req.body.RoomNum, req.body.BuildingName, req.body.VID, req.body,vacant, req.body.RoomID])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				return;
				// handle the error
		});	
	})

	// Delete a room
	.delete((req, res) => {
		res.setHeader('Access-Control-Allow-Origin', frontendHost);
		con.query('DELETE FROM ROOMS WHERE ROOM_ID = ?', [req.body.RoomID])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				return;
				// handle the error
		});	
	})

app.route("/villages")
	// Get all villages
	.get((req, res) => {
		res.setHeader('Access-Control-Allow-Origin', frontendHost);
		con.query('SELECT * FROM VILLAGES')
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				return;
				// handle the error
		});	
	})

	// Create a new village
	.post((req, res) => {
		res.setHeader('Access-Control-Allow-Origin', frontendHost);
		con.query('INSERT INTO VILLAGES (NAME) VALUES (?) ', [req.body.Name])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				return;
				// handle the error
		});	
	})

	// Update a village
	.put((req, res) => {
		res.setHeader('Access-Control-Allow-Origin', frontendHost);
		con.query('UPDATE VILLAGES SET NAME = ? WHERE VID = ?', [req.body.Name, req.body.VillageID])
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				return;
				// handle the error
		});	
	})

	// Delete a village
	.delete((req, res) => {
		res.setHeader('Access-Control-Allow-Origin', frontendHost);
		con.query('DELETE FROM VILLAGES WHERE VID = ?', [req.body.VillageID],)
			.then(rows => {
				res.send(JSON.stringify(rows));
			}, err => {
				return con.close().then( () => { throw err; } )
			})
			.catch( err => {
				res.sendStatus(400);
				return;
				// handle the error
		});	
	})

module.exports = app;
