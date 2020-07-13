import React, {Component} from 'react';
import Select from 'react-select';
import './ResidentDirectory.css';
import {Card, Button} from 'react-bootstrap';
import {Link, withRouter} from 'react-router-dom';
import IncidentReportView from "./IncidentReportView";

const colorStyles = {
    control: styles => ({...styles, backgroundColor: 'white'}),
    option: (styles, {data, isDisabled, isFocused, isSelected}) => {
        return {
            ...styles,
            backgroundColor: isDisabled ? 'red' : "white",
            color: 'black',
            cursor: isDisabled ? 'not-allowed' : 'default',
        };
    },
};

class ResidentDirectory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardHeader: "Select...",
            startDate: '?',
            displayIncRep: false,
            displayCard: false,
            residents: [],
            filteredResidents: [],
            resident: {},
            villages: [],
            village: {}
        };
    }

    componentDidMount() {
        this.reupdateData();
    }

    reupdateData = () => {
        //fetch resident data
        fetch("http://localhost:4000/residents")
            .then((res) => {
                if (res.ok) {
                    return res.text();
                } else {
                    throw new Error(res.message);
                }
            })
            .then((data) => {
                let residentArray = JSON.parse(data);
                this.setState({residents: residentArray, filteredResidents: residentArray})
            })
            .catch((error) => {
                console.log(error)
            });

        //fetch village data
        fetch("http://localhost:4000/villages")
            .then((res) => {
                if (res.ok) {
                    return res.text();
                } else {
                    throw new Error(res.message);
                }
            })
            .then((data) => {
                let villageArray = JSON.parse(data);
                this.setState({villages: villageArray})
            })
            .catch((error) => {
                console.log(error)
            });
    };

    handleChangeResident = (event) => {
        console.log(event)
        const date = new Date(Date.parse(event.resident.START_DATE))
        console.log(event.label);
        this.setState({
            cardHeader: event.label.toString(), //label
            resident: event.resident,
            startDate: date.toDateString(),
            displayCard: true,
            displayIncRep: false
        });
    };

    handleChangeVillage = (event) => {
        console.log(event.village.VID);
        console.log(this.state.residents);
        let VID = event.village.VID;
        let filteredResidentsUpdate = [];

        //go through array of objects, for each, if each obj.VID = VID, add to array
        this.state.residents.forEach((item) => {
            if (item.VID === VID) {
                filteredResidentsUpdate.push(item);
            }
        });

        this.setState({
            village: event.village,
            displayCard: false,
            cardHeader: "Select...",
            filteredResidents: filteredResidentsUpdate
        });
    };

    removeRes = (event) => { //Not currently working (just a start)
        console.log(this.state.resident);
        let data = {
            rid: this.state.resident.RID,
            fName: this.state.resident.FIRST_NAME,
            lName: this.state.resident.LAST_NAME,
            birthday: this.state.resident.BIRTHDAY,
            endDate: new Date().toISOString().slice(0, 10)
        };
        console.log(data);
        fetch("http://localhost:4000/residents", {
            body: JSON.stringify(data),
            mode: 'cors',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            method: "delete"
        }).then((response) => {
            if (response.status === 400) {
                response.json()
                    .then((text) => {
                        alert(text.error);
                    });
            } else if (response.status === 200) {
                this.setState({
                    displayCard: false,
                    cardHeader: '?',
                    resident: '',
                    startDate: '?'
                });
                this.reupdateData();
            }
        })
    };

    viewIncRep = (event) => {
        this.setState({
            displayIncRep: true,
            displayCard: false
        })
    };

    getAge = () => {
        const date = new Date(Date.parse(this.state.resident.BIRTHDAY));
        return (new Date().getFullYear() - date.getFullYear())
    };

    getBoolStr = (bool) => {
        return Boolean(bool).toString()
    };

    render() {
        return (
            <div style={{marginLeft: "20px", marginRight: "20px"}}>

                <div>
                    <Link to='/'><Button style={{marginTop: "20px", marginBottom: "20px"}} size="sm"
                                         variant="secondary">Back</Button></Link>

                    <div style={{ //title div
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "10px"
                    }}>
                        <h1>Resident Directory</h1>
                    </div>
                    <div style={{ //title div
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <p style={{fontSize: "large"}}>Please select a village to see the residents living in that village.
                            When no village is selected, you can search through all LIHI residents.</p>
                    </div>



                    <div style={{ //title div
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <label><strong>Village: </strong></label>
                        <Select id="village-options" size="lg" className="dropdown" onChange={this.handleChangeVillage}
                                options={this.state.villages.map((item) => ({
                                    label: item.NAME,
                                    village: item
                                }))}
                                styles={colorStyles}
                        />

                        <label style={{marginLeft: "20px"}}><strong>Residents:</strong></label>
                        <Select id="resident-options" size="lg" className="dropdown"
                                onChange={this.handleChangeResident} value={{value: "", label: this.state.cardHeader}}
                                options={this.state.filteredResidents.map((item) => ({
                                    label: item.FIRST_NAME + " " + item.LAST_NAME,
                                    resident: item
                                }))}
                                styles={colorStyles}
                        />
                    </div>

                    {this.state.displayCard &&
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <Card style={{width: '30rem', marginTop: "30px"}}>
                            <Card.Body>
                                <Card.Title>
                                    <Card.Img variant="top" src="person.png"
                                              style={{height: 30, width: 30}}/> {this.state.cardHeader}
                                </Card.Title>
                                <Card.Subtitle
                                    className="mb-2 text-muted">{this.state.resident.GENDER}, {this.getAge()}</Card.Subtitle>
                                <div>
                                    <h6>Residence Information:</h6>
                                    <ul style={{listStyleType: "none"}}>
                                        <li>Current Residence:
                                            house {this.state.resident.HOUSE_NUM} in {this.state.resident.VILLAGE_NAME} village
                                        </li>
                                        <li>Entry Date: {this.state.startDate} </li>
                                        <li>Last Known Residence: {this.state.resident.PREVIOUS_RESIDENCE || "N/A"}</li>
                                        <li>Previous Shelter
                                            Program: {this.state.resident.PREVIOUS_SHELTER_PROGRAM || "N/A"}</li>
                                    </ul>
                                    <h6>Personal Information:</h6>
                                    <ul style={{listStyleType: "none"}}>
                                        <li>Identification: {this.getBoolStr(this.state.resident.IDENTIFICATION)}</li>
                                        <li>Employed: {this.getBoolStr(this.state.resident.EMPLOYMENT)}</li>
                                        <li>Children: {this.getBoolStr(this.state.resident.CHILDREN)}</li>
                                        <li>Disabilities: {this.getBoolStr(this.state.resident.DISABILITIES)}</li>
                                        <li>Criminal
                                            History: {this.getBoolStr(this.state.resident.CRIMINAL_HISTORY)}</li>
                                    </ul>
                                </div>
                                <Button variant="primary" onClick={this.viewIncRep}>View Incident Reports</Button>
                                <Button variant="primary" style={{margin: "10px"}} onClick={this.removeRes}>Remove This
                                    Resident</Button>
                            </Card.Body>
                        </Card>
                    </div>
                    }
                </div>

                {this.state.displayIncRep &&
                <div>
                    <IncidentReportView
                        personName={this.state.resident.FIRST_NAME + " " + this.state.resident.LAST_NAME}
                        personID={this.state.resident.PID}/>
                </div>
                }

            </div>

        );
    }
}

export default withRouter(ResidentDirectory);