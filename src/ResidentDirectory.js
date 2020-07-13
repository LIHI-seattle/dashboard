import React, {Component} from 'react';
import Select from 'react-select';
import './ResidentDirectory.css'
import AddResident from './AddResident.js'
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
            value: '?',
            startDate: '?',
            data: {},
            displayIncRep: false,
            displayCard: false,
            displayEditPage: false,
            residents: []
        };
    }

    componentDidMount() {
        this.reupdateData();
    }

    reupdateData = () => {
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
                this.setState({residents: residentArray})
            })
            .catch((error) => {
                console.log(error)
            });
    };

    backToSearch = () => {
        this.setState({
            displayEditPage: false
        });
    };

    handleChange = (event) => {
        console.log(event)
        const date = new Date(Date.parse(event.data.START_DATE))
        this.setState({
            value: event.label, //label
            data: event.data,
            startDate: date.toDateString(),
            displayCard: true,
            displayIncRep: false
        });
    };

    removeRes = (event) => { //Not currently working (just a start)
        console.log(this.state.data);
        let data = {
            rid: this.state.data.RID,
            fName: this.state.data.FIRST_NAME,
            lName: this.state.data.LAST_NAME,
            birthday: this.state.data.BIRTHDAY,
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
                    value: '?',
                    data: '',
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
        //view incident report (fetch data from server + display has whole page)
    };

    getAge = () => {
        const date = new Date(Date.parse(this.state.data.BIRTHDAY));
        return (new Date().getFullYear() - date.getFullYear())
    };

    getBoolStr = (bool) => {
        return Boolean(bool).toString()
    };

    render() {
        return (
            //search bar that grabs data from server and filters

            //on select of a certain option then a card of the person image + other info displayed
            <div style={{marginLeft: "20px", marginRight: "20px"}}>
                {!this.state.displayEditPage && //search bar page
                <div>
                    <Link to='/'><Button style={{marginTop: "20px", marginBottom: "20px"}} size="sm"
                                         variant="secondary">Back</Button></Link>
                    <div style={{ //title div
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <h1>Resident Directory</h1>
                    </div>

                    <div style={{ //title div
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Select id="resident-options" size="lg" className="dropdown" onChange={this.handleChange}
                                options={this.state.residents.map((item) => ({
                                    label: item.FIRST_NAME + " " + item.LAST_NAME,
                                    data: item
                                }))}
                                styles={colorStyles}
                        />

                        <Link to="/addresident">
                            <Button className='add_button' size="md">
                                <span>Add Resident</span>
                            </Button>
                        </Link>
                        <Link to="/addvillage">
                            <Button className='add_button' size="md">
                                <span>Add Village</span>
                            </Button>
                        </Link>
                    </div>

                    {this.state.displayCard &&

                    <div style={{display: "flex", justifyContent: "center"}}>
                        <Card style={{width: '30rem', marginTop: "30px"}}>
                            <Card.Body>
                                <Card.Title>
                                    <Card.Img variant="top" src="person.png"
                                              style={{height: 30, width: 30}}/> {this.state.value}
                                </Card.Title>
                                <Card.Subtitle
                                    className="mb-2 text-muted">{this.state.data.GENDER}, {this.getAge()}</Card.Subtitle>
                                <div>
                                    <h6>Residence Information:</h6>
                                    <ul style={{listStyleType: "none"}}>
                                        <li>Current Residence: house {this.state.data.HOUSE_NUM} in {this.state.data.VILLAGE_NAME} village</li>
                                        <li>Entry Date: {this.state.startDate} </li>
                                        <li>Last Known Residence: {this.state.data.PREVIOUS_RESIDENCE || "N/A"}</li>
                                        <li>Previous Shelter
                                            Program: {this.state.data.PREVIOUS_SHELTER_PROGRAM || "N/A"}</li>
                                    </ul>
                                    <h6>Personal Information:</h6>
                                    <ul style={{listStyleType: "none"}}>
                                        <li>Identification: {this.getBoolStr(this.state.data.IDENTIFICATION)}</li>
                                        <li>Employed: {this.getBoolStr(this.state.data.EMPLOYMENT)}</li>
                                        <li>Children: {this.getBoolStr(this.state.data.CHILDREN)}</li>
                                        <li>Disabilities: {this.getBoolStr(this.state.data.DISABILITIES)}</li>
                                        <li>Criminal History: {this.getBoolStr(this.state.data.CRIMINAL_HISTORY)}</li>
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
                }

                {this.state.displayEditPage && //add resident page
                <div>
                    <Button style={{margin: "10px"}} size="sm" variant="secondary"
                            onClick={this.backToSearch}>Back</Button>
                    <AddResident reupdateData={this.reupdateData}/>
                </div>
                }

                {this.state.displayIncRep &&
                <div>
                    <IncidentReportView personName={this.state.data.FIRST_NAME + " " + this.state.data.LAST_NAME} personID={this.state.data.PID}/>
                </div>
                }

            </div>

        );
    }
}

export default withRouter(ResidentDirectory);