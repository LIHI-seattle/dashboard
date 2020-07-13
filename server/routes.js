"use strict";
var mysql = require("mysql");
var express = require("express");
var bodyParser = require('body-parser');
const excelToJson = require('convert-excel-to-json');
var multer = require("multer");
var upload = multer();
var app = express();

app.use(express.json());
app.use(bodyParser.json());

const cors = require('cors');

var {
    serverHost, serverUser, serverPassword,
    serverDatabase, serverPort, frontendHost
} = require('./common')


const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

readline.question(`What's your name?`, (pwd) => {
    console.log(`Enter MySQL password: ${pwd}!`)
    readline.close()
})

async function insert(sql, id, data) {
    for (let i = 0; i < data.length; i++)
        await con.query(sql, [id, data[i]]);
}

async function insertVillage(sql, numHouses, vid) {
	for (let i=0; i<numHouses; i++)
		await con.query(sql, [i + 1, vid, true]);
}


class Database {
    constructor(config) {
        this.connection = mysql.createConnection({
            host: serverHost,
            user: serverUser,
            password: serverPassword,
            database: serverDatabase,
			port: serverPort
        });
        this.connection.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
        });
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
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
    .get((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', frontendHost);
        con.query('SELECT PID, FIRST_NAME, LAST_NAME FROM PEOPLE WHERE ROLE_ID != 2')
            .then(rows => {
                res.status(200).send(JSON.stringify(rows))
            }, err => {
                return con.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
                res.sendStatus(400);
                // handle the error
            });
    })

    // Create a new person
    .post((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', frontendHost);
        con.query('INSERT INTO PEOPLE (FIRST_NAME, LAST_NAME, BIRTHDAY, ROLE_ID, VID) VALUES (?, ?, ?, ?, ?)', [req.body.fName, req.body.lName, req.body.birthday, req.body.RoleID, req.body.VID])
            .then(rows => {
                res.status(201).send(JSON.stringify(rows));
            }, err => {
                return con.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
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
                return con.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
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
                return con.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
                res.sendStatus(400);
                return;
            });
    })


app.route("/residents")
    // Get all residents
    .get((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', frontendHost);
        con.query('SELECT RESIDENTS.*, HOUSES.HOUSE_NUM, PEOPLE.*, VILLAGES.NAME AS VILLAGE_NAME FROM RESIDENTS JOIN HOUSES ON RESIDENTS.HOUSE_ID = HOUSES.HOUSE_ID JOIN PEOPLE ON RESIDENTS.PID = PEOPLE.PID JOIN VILLAGES ON VILLAGES.VID = PEOPLE.VID WHERE RESIDENTS.IN_RESIDENCE = 1')
            .then(rows => {
                res.status(200).json(rows);
                return Promise.resolve(rows);
            }, err => {
                return con.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
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
                    return Promise.resolve().then(() => {
                        throw new Error("Bad request: Village not found.");
                    })
                }
            }, err => {
                return Promise.resolve().then(() => {
                    throw err;
                })
            })
            // Selects the person if the house is found.
            .then(houseRows => {
                houseResults = houseRows;
                if (houseResults.length > 0) {
                    if (houseResults[0].VACANT === 0) {
                        return Promise.resolve().then(() => {
                            throw new Error('Bad request: House not vacant');
                        })
                    }
                    return con.query('SELECT PID FROM PEOPLE WHERE FIRST_NAME = ? AND LAST_NAME = ? AND BIRTHDAY = ?', [newRes.fName, newRes.lName, newRes.birthday]);
                } else {
                    return Promise.resolve().then(() => {
                        throw new Error('Bad request: House not found');
                    })
                }
            }, err => {
                return Promise.resolve().then(() => {
                    throw err;
                })
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
                return Promise.resolve().then(() => {
                    throw err;
                })
            })
            // Returns the inserted row if the previous promise executed an insert, otherwise verifies that the person is not already a resident somewhere else (Users should only have one residence at any given time. This check is required to prevent a person from being added as a resident to more than one house). Then updates existing people information.
            // NOTE: No user information is updated if they are currently residing in a house
            .then(insChkResidenceRows => {
                if (insChkResidenceRows.insertId) {
                    return Promise.resolve(insChkResidenceRows);
                }

                for (var i = 0; i < insChkResidenceRows.length; i++) {
                    if (insChkResidenceRows[i].IN_RESIDENCE === 1) {
                        return Promise.resolve().then(() => {
                            throw new Error('Bad request: Existing residence found');
                        })
                    }
                }

                return con.query('UPDATE PEOPLE SET GENDER = ?, EMPLOYMENT = ?, IDENTIFICATION = ?, PREVIOUS_RESIDENCE = ?, DISABILITIES = ?, CHILDREN = ?, PREVIOUS_SHELTER_PROGRAM = ?, CRIMINAL_HISTORY = ? WHERE FIRST_NAME = ? AND LAST_NAME = ? AND BIRTHDAY = ?',
                    [newRes.gender, newRes.employment, newRes.identification, newRes.pastResidence, newRes.disabilities, newRes.children, newRes.pastShelter, newRes.criminalHistory, newRes.fName, newRes.lName, newRes.birthday]);
            }, err => {
                return Promise.resolve().then(() => {
                    throw err;
                })
            })
            // Sets the new person ID and inserts the new residence
            .then(persResRows => {
                if (persResRows.insertId) {
                    personID = persResRows.insertId;
                } else {
                    personID = personResults[0].PID;
                }
                return con.query('INSERT INTO RESIDENTS (PID, HOUSE_ID, START_DATE, END_DATE, IN_RESIDENCE) VALUES (?, ?, ?, ?, ?) ', [personID, houseResults[0].HOUSE_ID, req.body.startDate, null, true]);
            }, err => {
                return Promise.resolve().then(() => {
                    throw err;
                })
            })
            // Select the newly added residence
            .then(insResRows => {
                return con.query('SELECT * FROM RESIDENTS WHERE RID = ?', insResRows.insertId);
            }, err => {
                return Promise.resolve().then(() => {
                    throw err;
                })
            })
            // Update vacancy of the house
            .then(newResident => {
                addedResident = newResident;
                return con.query('UPDATE HOUSES SET VACANT = FALSE WHERE HOUSE_ID = ?', houseResults[0].HOUSE_ID);
            }, err => {
                return Promise.resolve().then(() => {
                    throw err;
                })
            })
            // Return new resident
            .then(updatedVacancy => {
                res.status(201).json((addedResident[0]));
            }, err => {
                return Promise.resolve().then(() => {
                    throw err;
                })
            })
            .catch(err => {
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
                return con.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
                res.sendStatus(400);
                return;
                // handle the error
            });
    })

    // Delete resident (add end date and change residence status)
    .delete((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', frontendHost);
        let delRes = req.body;
        con.query('UPDATE RESIDENTS SET END_DATE = ?, IN_RESIDENCE = False WHERE RID = ?', [delRes.endDate, delRes.rid])
            .then(rows => {
                res.sendStatus(200);
            }, err => {
                return Promise.resolve().then(() => {
                    throw err;
                })
            })
            .catch(err => {
                console.log("Error message: " + err.message);
                if (!err.message.includes("Bad request:")) {
                    res.status(400).json({'error': "Bad request"});
                } else {
                    res.status(400).json({'error': err.message});
                }
            });

        // con.query('SELECT * FROM PEOPLE WHERE FIRST_NAME = ? AND LAST_NAME = ? AND BIRTHDAY = ?', [delRes.fName, delRes.lName, delRes.birthday])
        // 	.then(rows => {
        // 		if (rows.length == 1) {
        // 			return Promise.resolve(rows[0]);
        // 		} else {
        // 			return Promise.resolve().then( () => { throw new Error("Bad request: No resident found.");} )
        // 		}
        // 	}, err => {
        // 		return Promise.resolve().then( () => { throw err; } )
        // 	})
        // 	.then(row => {
        // 		return con.query('UPDATE RESIDENTS SET END_DATE = ? AND IN_RESIDENCE = False WHERE PID = ? AND IN_RESIDENCE = TRUE', [delRes.endDate, row.PID])
        // 	})
        // 	.then(rows => {
        // 		res.sendStatus(200);
        // 	}, err => {
        // 		return Promise.resolve().then( () => { throw err; } )
        // 	})
        // 	.catch( err => {
        // 		console.log("Error message: " + err.message);
        // 		if (!err.message.includes("Bad request:")) {
        // 			res.status(400).json({'error': "Bad request"});
        // 		} else {
        // 			res.status(400).json({'error': err.message});
        // 		}
        // 	});
    })


app.route("/permissions")
    // Get all permissions
    .get((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', frontendHost);
        con.query('SELECT * FROM PERMISSIONS')
            .then(rows => {
                res.send(JSON.stringify(rows));
            }, err => {
                return con.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
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
                return con.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
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
                return con.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
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
                return con.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
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
                return con.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
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
		let newVillage = req.body;
		let numHouses = parseInt(newVillage.numHouses);
		let vid = '';
		if (isNaN(numHouses)) {
			res.status(400).json({'error': "Bad request. Number of houses is not a valid integer."});
		} else {
			con.query('INSERT INTO VILLAGES (NAME) VALUES (?) ', [newVillage.villageName])
				.then(rows => {
					if (rows.insertId) {
						vid = rows.insertId;
						let insertHouse = 'INSERT INTO HOUSES (HOUSE_NUM, VID, VACANT) VALUES (?, ?, ?)';
						return insertVillage(insertHouse, numHouses, vid);
					} else {
						return Promise.resolve().then( () => { throw new Error("Bad request: Failed to add village.");} )
					}
				}, err => {
					return con.close().then( () => { throw new Error("Bad request: Village already exists."); } )
				})
				.then(result => {
					res.sendStatus(201);
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
		}
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

    // Update a room
    .put((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', frontendHost);
        con.query('UPDATE ROOMS SET ROOM_NUM = ?, BLDG_NAME = ?, VID = ?, VACANT = ? WHERE ROOM_ID = ?', [req.body.RoomNum, req.body.BuildingName, req.body.VID, req.body, vacant, req.body.RoomID])
            .then(rows => {
                res.send(JSON.stringify(rows));
            }, err => {
                return con.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
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
                return con.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
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
                return con.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
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
                return con.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
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
                return con.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
                res.sendStatus(400);
                return;
                // handle the error
            });
    })

async function bulkResidentInsert(data) {
	let retrieveVillageSQL = 'SELECT VID FROM VILLAGES WHERE NAME = ?'
	let insertPeopleSQL = 'INSERT INTO PEOPLE (FIRST_NAME, LAST_NAME, BIRTHDAY, ROLE_ID, VID, GENDER, EMPLOYMENT, IDENTIFICATION, DISABILITIES, CHILDREN, CRIMINAL_HISTORY) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
	let retrieveHouseSQL = 'SELECT HOUSE_ID FROM HOUSES WHERE VID = ? AND HOUSE_NUM = ?'
	let insertResidentSQL = 'INSERT INTO RESIDENTS (PID, HOUSE_ID, START_DATE, END_DATE, IN_RESIDENCE) VALUES (?, ?, ?, ?, ?)'
	try {
		for (let i = 1; i < data.length; i++) {
			data[i].employment = (data[i].employment == 'Yes');
			data[i].identification = (data[i].identification == 'Yes');
			data[i].disabilities = (data[i].disabilities == 'Yes');
			data[i].children = (data[i].children == 'Yes');
			data[i].criminalHistory = (data[i].criminalHistory == 'Yes');
			let vid = await con.query(retrieveVillageSQL, data[i].village);
			let houseID = await con.query(retrieveHouseSQL, [vid[0].VID, data[i].house]);
			let addedPerson = await con.query(insertPeopleSQL, [data[i].firstName, data[i].lastName, data[i].birthday, 3, vid[0].VID, data[i].gender, data[i].employment, data[i].identification, data[i].disabilities, data[i].children, data[i].criminalHistory]);
			let pid = addedPerson.insertId;
			let insertResident = await con.query(insertResidentSQL, [pid, houseID[0].HOUSE_ID, data[i].dateOfEntry, null, true]);
		}
		return Promise.resolve();
	} catch (error) {
		console.log(error);
		throw error;
	}
}

app.post("/sendFile",  upload.single('fileName'), function(req, res){
	res.setHeader('Access-Control-Allow-Origin', frontendHost);
	//file contents
	try {
		let result = excelToJson({
			source: req.file.buffer,
			header:{
				rows: 1
			},
			columnToKey: {
				A: 'firstName',
				B: 'lastName',
				C: 'dateOfEntry',
				D: 'birthday',
				E: 'age',
				F: 'gender',
				G: 'employment',
				H: 'identification',
				I: 'lastResidence',
				J: 'disabilities',
				K: 'children',
				L: 'lastProgram',
				M: 'criminalHistory',
				N: 'house',
				O: 'village'
			},
		});
		let data = result.Sheet1;
	
		bulkResidentInsert(data)
			.then(rows => {
				res.sendStatus(201);
				console.log("Successfully uploaded: " + req.file.originalname);
			}, err => {
				return Promise.resolve().then( () => { throw new Error('Bad request: Verify document formatting and presence of villages/houses in the database.'); } )
			})
			.catch( err => {
				console.log("Error message: " + err.message);
				if (!err.message.includes("Bad request:")) {
					res.status(400).json({'error': "Bad request"});
				} else {
					res.status(400).json({'error': err.message});
				}
			});
	} catch {
		res.status(400).json({'error': "Bad request"});
	}
	
});



app.route("/incidentReport")
    // Add new incident report
    .post((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', frontendHost);
        let incident = req.body;
        let newIncidentID = "";
        incident.injury = (incident.injury == 'true');
        incident.emergencyRoom = (incident.emergencyRoom == 'true');
		incident.policeReport = (incident.policeReport == 'true');
        con.query('INSERT INTO INCIDENTS (INVOLVED_NAMES, NOTIFIED_NAMES, OBSERVER_NAMES, FOLLOW_UP, INCIDENT_DATE, TIME, VID, LOCATION, DESCRIPTION, INJURY, INJURY_DESCRIPTION, ER_VISIT, ER_HOSPITAL, POLICE_REPORT, PR_NUMBER, AUTHOR_ID , REVIEWER_ID , AUTHOR_DATE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [incident.peopleInvolvedNames.join(", "), incident.notifiedNames.join(", "), incident.observersNames.join(", "), incident.followUp, incident.incidentDate, incident.time, incident.village, incident.location, incident.description, incident.injury, incident.injuryDescription, incident.emergencyRoom, incident.hospital, incident.policeReport, incident.reportNumber, incident.signature, incident.reviewerName, incident.currentDate])
            .then(rows => {
                if (rows.insertId) {
                    newIncidentID = rows.insertId;
                    let insertPeople = 'INSERT INTO INCIDENTS_PEOPLE (INID, PID) VALUES (?, ?)';
                    return insert(insertPeople, newIncidentID, incident.peopleInvolved);
                } else {
                    return Promise.resolve().then(() => {
                        throw new Error("Bad request: Failed to add incident.");
                    })
                }
            }, err => {
                return Promise.resolve().then(() => {
                    throw err;
                })
            })
            .then(result => {
                let insertObserver = 'INSERT INTO INCIDENTS_OBSERVER (INID, PID) VALUES (?, ?)';
                return insert(insertObserver, newIncidentID, incident.observers);
            }, err => {
                return Promise.resolve().then(() => {
                    throw err;
                })
            })
            .then(result => {
                let insertNotified = 'INSERT INTO INCIDENTS_NOTIFIED (INID, PID) VALUES (?, ?)';
                return insert(insertNotified, newIncidentID, incident.peopleNotified);
            }, err => {
                return Promise.resolve().then(() => {
                    throw err;
                })
            })
            .then(result => {
                res.sendStatus(201);
            })
            .catch(err => {
                console.log("Error message: " + err.message);
                if (!err.message.includes("Bad request:")) {
                    res.status(400).json({'error': "Bad request"});
                } else {
                    res.status(400).json({'error': err.message});
                }
            });
    })

//seperate incidentRep get request to accept parameter
//uses PID to find INCID to get the incident and returns that incident
app.get('/incidentReport/:pid', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', frontendHost);
    con.query('SELECT INCIDENTS_PEOPLE.*, INCIDENTS.*, VILLAGES.NAME AS VILLAGE_NAME, ' +
                    'RP.FIRST_NAME AS R_FNAME, RP.LAST_NAME AS R_LNAME, AP.FIRST_NAME AS A_FNAME, AP.LAST_NAME AS A_LNAME ' +
                    'FROM INCIDENTS_PEOPLE JOIN INCIDENTS ON INCIDENTS_PEOPLE.INID = INCIDENTS.INID JOIN VILLAGES ON VILLAGES.VID = INCIDENTS.VID ' +
                    'JOIN PEOPLE AS RP ON INCIDENTS.REVIEWER_ID = RP.PID JOIN PEOPLE AS AP ON INCIDENTS.AUTHOR_ID = AP.PID WHERE INCIDENTS_PEOPLE.PID = ?',
                    [req.params.pid])
        //         //JOIN INCIDENTS_OBSERVER ON INCIDENTS_PEOPLE.INID = INCIDENTS_OBSERVER.INID JOIN INCIDENTS_NOTIFIED ON INCIDENTS_PEOPLE.INID = INCIDENTS_NOTIFIED.INID
        //JOIN INCIDENTS ON INCIDENTS_PEOPLE.INID = INCIDENTS.INID WHERE INCIDENTS_PEOPLE.PID = ?
        .then(rows => {
            res.status(200).json(rows);
            return Promise.resolve(rows);
        }, err => {
            return con.close().then(() => {
                throw err;
            })
        })
        .catch(err => {
            res.status(400).send(err.message);
        });
})

module.exports = app;
