import React, {Component} from 'react';
import Button from "react-bootstrap/Button";

export default class AddResident extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            birthday: "",
            village: "",
            room: "",
            startDate: ""
        };
    }

    handleChange = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    mySubmitHandler = () => {
        // send json object
        let data = {
            fName: this.state.firstName,
            lName: this.state.lastName,
            birthday: this.state.birthday,
            village: this.state.village,
            room: this.state.room,
            startDate: this.state.startDate
        }
        fetch("http://localhost:4000/residents", {
            body: JSON.stringify(data),
            mode: 'cors',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            method: "post"
        }).then(function (response) {
            if (response.status === 400) {
                response.json()
                    .then((text) => {
                        alert(text.error);
                    });
            }
            console.log(response.status);
            console.log(response);
            // this.props.reupdateData();
            // return response.json();
        });
    }

    render() {
        return (
            <div style={{marginLeft: "30px"}}>
                <p>Please fill out the following information for the resident you wish to add.</p>
                <form onSubmit={this.mySubmitHandler}>
                    <h5>Personal Information</h5>
                    <div style={{ //title div
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "10px"
                    }}>
                        <label>First Name:</label>
                        <input style={{width: "300px", margin: "10px"}} type="text" className="form-control"
                               placeholder="First Name" name="firstName"
                               onChange={this.handleChange}/>
                        <label>Last Name:</label>
                        <input style={{width: "300px", margin: "10px"}} type="text" className="form-control"
                               placeholder="Last Name" name="lastName"
                               onChange={this.handleChange}/>
                        <label>Birthday:</label>
                        <input style={{width: "300px", margin: "10px"}} type="date" className="form-control"
                               placeholder="MM/DD/YYYY" name="birthday"
                               onChange={this.handleChange}/>
                    </div>
                    <h5>Residential Information</h5>
                    <div style={{ //title div
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "10px"
                    }}>
                        <label>Village Name:</label>
                        <input style={{width: "300px", margin: "10px"}} type="text" className="form-control" placeholder="Village Name" name="village"
                               onChange={this.handleChange}/>
                        <label>House Number:</label>
                        <input style={{width: "300px", margin: "10px"}} type="text" className="form-control" placeholder="Room Number" name="room"
                               onChange={this.handleChange}/>
                        <label>Entry Date:</label>
                        <input style={{width: "300px", margin: "10px"}} type="date" className="form-control" name="startDate" onChange={this.handleChange}/>
                    </div>
                    <Button style={{margin: "10px"}} size="md" type="submit" className="btn btn-primary" value="Submit">Add Resident</Button>
                </form>
            </div>
        );
    }
}

