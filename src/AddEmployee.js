import React, {Component} from 'react'
import Button from "react-bootstrap/Button";
import {Link} from 'react-router-dom';
import { serverHost } from './commons';

export default class AddEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addedEmployee: false,
        };
    }

    updateEmployeeStatus(status) {
        this.setState({addedEmployee: status});
    }

    render() {
        return(
            <div style={{marginLeft: "20px", marginRight: "20px"}}>
                <Link to="/"><Button style={{marginTop: "20px", marginBottom: "20px"}} size="sm"
                                                      variant="secondary" onClick={() => {
                    this.setState({addedEmployee: false})
                }}>Back</Button></Link>
                {this.state.addedEmployee === true ?
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        Successfully added employee!
                        <button type="button" className="close" aria-label="Close" onClick={() => {
                            this.setState({addedEmployee: false})
                        }}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div> : <div/>}
                <div style={{ //title div
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <h1>Add Employee</h1>
                </div>
                <p style={{fontSize: "large"}}>Please fill out the following information for the employee you wish to add.</p>
                <AddEmployeeForm employeeUpdate={this.updateEmployeeStatus.bind(this)}/>
            </div>
        )
    }
}

class AddEmployeeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            startDate: "",
        };
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({[name]: value});
    }

    mySubmitHandler = (e) => {
        e.preventDefault();
        this.props.employeeUpdate(false);

        var form = document.getElementById("addEmployee");
        if (this.state.firstName === "" ||
            this.state.lastName === "" ||
            this.state.startDate === "") {
            alert("All fields are required.");
        } else {
            let data = {
                fName: this.state.firstName,
                lName: this.state.lastName,
                startDate: this.state.startDate,
            }
            fetch(serverHost + "/employees", {
                body: JSON.stringify(data),
                mode: 'cors',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                method: "post"
            }).then((response) => {
                if (response.status === 400) {
                    response.json()
                        .then((text) => {
                            alert(text.error);
                        });
                } else if (response.status === 201) {
                    form.reset();
                    this.props.employeeUpdate(true);
                }
            })
        }
    }

    render() {
        return(
            <form id="addEmployee" onSubmit={(e) => {
                this.mySubmitHandler(e)
            }}>
                <h4>Employee Information</h4>
                <div id="addemployeeform" style={{ //title div
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px"
                }}>
                    <label style={{paddingRight: "0px", paddingLeft: "10px"}}>First Name:</label>
                    <input style={{width: "200px", margin: "10px"}} type="text" className="form-control"
                           placeholder="First Name" name="firstName"
                           onChange={this.handleChange}/>
                    <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Last Name:</label>
                    <input style={{width: "200px", margin: "10px"}} type="text" className="form-control"
                           placeholder="Last Name" name="lastName"
                           onChange={this.handleChange}/>
                    <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Entry Date:</label>
                    <input style={{width: "175px", margin: "10px"}} type="date" className="form-control"
                           name="startDate"
                           onChange={this.handleChange}/>
                </div>
                <Button style={{margin: "15px"}} size="md" type="submit" className="btn btn-primary" value="Submit">Add
                Employee</Button>
            </form>
        )
    }
}