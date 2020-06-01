import React, {Component} from 'react';
import Select from 'react-select';
import './ResidentDirectory.css'
import AddResident from './AddResident.js'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom'


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

    reupdateData = () =>{
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
                this.setState({ residents: residentArray})
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

    render() {
        return (
            //search bar that grabs data from server and filters

            //on select of a certain option then a card of the person image + other info displayed
            <div>
                {!this.state.displayEditPage && //search bar page
                <div>
                    <Button style={{margin: "10px"}} size="sm" variant="secondary" onClick={() => {this.props.history.goBack()}}>Back</Button>
                    <div style={{ //title div
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"}}>
                        <h1>Resident Directory</h1>
                    </div>

                        <div style={{ //title div
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"}}>
                            <Select size="lg" className="dropdown" onChange={this.handleChange}
                                options={this.state.residents.map((item) => ({label: item.FIRST_NAME, startDate: item.START_DATE}))}
                            />

                            <Button size="md" className="add_button" onClick={this.addOrRemoveResident}>Add or Remove a Resident</Button>
                        </div>

                        {this.state.displayCard &&
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src="logo.svg" />
                                <Card.Body>
                                    <Card.Title>{this.state.value}</Card.Title>
                                    <Card.Text>
                                        Start Date: {this.state.startDate}
                                    </Card.Text>
                                    <button variant="primary">Go somewhere</button>
                                </Card.Body>
                            </Card>
                        }
                </div>
                }

                {this.state.displayEditPage && //add resident page
                    <div>
                        <button onClick={this.backToSearch}>Back</button>
                        <AddResident reupdateData={this.reupdateData}/>
                    </div>
                }

            </div>

        );
    }
}

export default withRouter(ResidentDirectory);