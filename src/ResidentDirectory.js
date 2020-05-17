import React, {Component} from 'react';
import Select from 'react-select';
import './ResidentDirectory.css'
import AddResident from './AddResident.js'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {withRouter} from 'react-router-dom';
import { Link} from 'react-router-dom';



class ResidentDirectory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '?',
            startDate: '?',
            displayCard: false,
            displayEditPage: false,
            residents: []
        };
    }

    componentDidMount() {
        this.reupdateData();
    }

    reupdateData = () => {
        console.log("reupdating data");
        fetch("http://localhost:4000/residents")
            .then((res) => {
                if (res.ok) {
                    return res.text();
                } else {
                    throw new Error(res.message);
                }
                // res.text();
            })
            .then((data) => {
                let residentArray = JSON.parse(data);
                this.setState({residents: residentArray})
                console.log(this.state.residents)
            })
            .catch((error) => {
                console.log(error)
            });
    };

    back = () => {
        this.props.onBack()
    };

    backToSearch = () => {
        this.setState({
            displayEditPage: false
        });
    };

    handleChange = (event) => {
        this.setState({
            value: event.label, //label
            startDate: event.startDate,
            displayCard: true
        });
        console.log(event.startDate)
    };

    addOrRemoveResident = (event) => {
        this.setState({
            displayEditPage: true
        });
        //reupdate data
    };

    addOrRemoveResident = (event) => {
        this.setState({
            displayEditPage: true
        });
        //reupdate data
    };

    render() {
        return (
            //search bar that grabs data from server and filters

            //on select of a certain option then a card of the person image + other info displayed
            <div>
                {!this.state.displayEditPage && //search bar page
                <div>
                    <Button style={{margin: "10px"}} size="sm" variant="secondary" onClick={() => {
                        this.props.history.goBack()
                    }}>Back</Button>
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
                        {console.log(this.state.residents)}
                        <Select size="lg" className="dropdown" onChange={this.handleChange}
                                options={this.state.residents.map((item) => ({
                                    label: item.FIRST_NAME + " " + item.LAST_NAME,
                                    startDate: item.START_DATE
                                }))}
                        />

                        <Link to="/addresident">
                            <Button  className='add_button' size="md" >
                                <span>Add Resident</span>
                            </Button>
                        </Link>
                    </div>

                    {this.state.displayCard &&
                    <Card style={{width: '30rem', marginTop: "30px", marginLeft: "500px"}}>
                        <Card.Img variant="top" src="placeHolder.png"/>
                        <Card.Body>
                            <Card.Title>{this.state.value}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Gender, Age</Card.Subtitle>
                            <Card.Text>
                                <h6>Residence Information:</h6>
                                <ul style={{listStyleType: "none"}}>
                                    <li>Current Residence: Village + Room Number</li>
                                    <li> Entry Date: {this.state.startDate} </li>
                                    <li>Last Known Residence:</li>
                                    <li> Previous Shelter Program:</li>
                                </ul>
                                <h6>Personal Information:</h6>
                                <ul style={{listStyleType: "none"}}>
                                    <li>Identification:</li>
                                    <li>Employed:</li>
                                    <li>Children:</li>
                                    <li>Disabilities:</li>
                                    <li>Criminal History:</li>
                                </ul>
                            </Card.Text>
                            <Button variant="primary">View Incident Report</Button>
                            <Button variant="primary" style={{margin: "10px"}}>Remove This Resident</Button>
                        </Card.Body>
                    </Card>
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

            </div>

        );
    }
}

export default withRouter(ResidentDirectory);