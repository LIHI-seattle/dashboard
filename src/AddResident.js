import React, {Component} from 'react';
import Button from "react-bootstrap/Button";
import {Link} from 'react-router-dom';
import Select from "react-select";
import { serverHost } from './commons';


export default class AddResident extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addedResident: false,
            uploadedResidents: false,
        };
    }

    updateResidentStatus(status) {
        this.setState({addedResident: status});
    }

    updateUploadedResidentsStatus(status) {
      this.setState({uploadedResidents: status});
    }

    render() {
        return (
            <div style={{marginLeft: "20px", marginRight: "20px"}}>
                <Link to='/'><Button style={{marginTop: "20px", marginBottom: "20px"}} size="sm"
                                     variant="secondary">Back</Button></Link>
                {this.state.addedResident === true ?
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        Successfully added resident!
                        <button type="button" className="close" aria-label="Close" onClick={() => {
                            this.setState({addedResident: false})
                        }}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div> : <div/>}
                {this.state.uploadedResidents === true ?
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                      Successfully uploaded file!
                      <button type="button" className="close" aria-label="Close" onClick={() => {
                          this.setState({uploadedResidents: false})
                      }}>
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div> : <div/>}
                <div style={{ //title div
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <h1>Add Resident</h1>
                </div>
                <p style={{fontSize: "large"}}>Please fill out the following information for the resident you wish to add.</p>
                <AddResidentForm residentUpdate={this.updateResidentStatus.bind(this)}/>
                <UploadResidents fileUpdate={this.updateUploadedResidentsStatus.bind(this)}/>
            </div>
        );
    }
}

class AddResidentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            birthday: "",
            village: "",
            house: "",
            startDate: "",
            gender: "",
            employment: "",
            identification: "",
            pastResidence: "",
            disabilities: "",
            children: "",
            pastShelter: "",
            criminalHistory: "",
        };
    }

    componentDidMount() {
        this.getVillages();
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({[name]: value});
    }

    getVillages = () =>{
        fetch(serverHost + "/villages")
            .then((res) => {
                if (res.ok) {
                    return res.text();
                } else {
                    throw new Error(res.message);
                }
            })
            .then((data) => {
                let villageArray = JSON.parse(data);
                let villages = villageArray.map((item) => ({label: item.NAME, value: item.VID}));
                this.setState({ villages: villages}) //villages are options and village is the name
            })
            .catch((error) => {
                console.log(error)
            });
    };

    handleDropdownMulti(option, name) {
        console.log(option);
        console.log(name);
        this.setState(state => {
            return {
                villageValue: option,
                [name]: option.label
            };
        });
    }

    mySubmitHandler = (e) => {
        e.preventDefault();
        this.props.residentUpdate(false);
        var form = document.getElementById("addResident");
        if (this.state.firstName === "" ||
            this.state.lastName === "" ||
            this.state.birthday === "" ||
            this.state.village === "" ||
            this.state.house === "" ||
            this.state.startDate === "" ||
            this.state.gender === "" ||
            this.state.employment === "" ||
            this.state.identification === "" ||
            this.state.disabilities === "" ||
            this.state.children === "" ||
            this.state.criminalHistory === "") {
            alert("All fields except past residence and shelter program are required");
        } else {
            let data = {
                fName: this.state.firstName,
                lName: this.state.lastName,
                birthday: this.state.birthday,
                village: this.state.village,
                house: this.state.house,
                startDate: this.state.startDate,
                gender: this.state.gender,
                employment: this.state.employment,
                identification: this.state.identification,
                pastResidence: this.state.pastResidence,
                disabilities: this.state.disabilities,
                children: this.state.children,
                pastShelter: this.state.pastShelter,
                criminalHistory: this.state.criminalHistory
            }
            fetch(serverHost + "/residents", {
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
                } else {
                    form.reset();
                    this.props.residentUpdate(true);
                }
            })
        }
    }

    render() {
        return (<form id="addResident" onSubmit={(e) => {
            this.mySubmitHandler(e)
        }}>
            <h4>Personal Information</h4>
            <div id="addresidentform" style={{ //title div
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
                <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Birthday:</label>
                <input style={{width: "175px", margin: "10px"}} type="date" className="form-control"
                       placeholder="MM/DD/YYYY" name="birthday"
                       onChange={this.handleChange}/>
                <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Gender:</label>
                <input style={{width: "125px", margin: "10px"}} type="text" className="form-control"
                       placeholder="e.g. M, F, X" name="gender"
                       onChange={this.handleChange}/>
                <div>
                    <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Employment:</label>
                    <select style={{width: "60px", height: "27px", margin: "10px"}} name="employment"
                            onChange={(event) => {
                                this.handleChange(event)
                            }}>
                        <option value=""></option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                    <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Identification:</label>
                    <select style={{width: "60px", height: "27px", margin: "10px"}} name="identification"
                            onChange={(event) => {
                                this.handleChange(event)
                            }}>
                        <option value=""></option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                    <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Disability:</label>
                    <select style={{width: "60px", height: "27px", margin: "10px"}} name="disabilities"
                            onChange={(event) => {
                                this.handleChange(event)
                            }}>
                        <option value=""></option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                    <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Children:</label>
                    <select style={{width: "60px", height: "27px", margin: "10px"}} name="children"
                            onChange={(event) => {
                                this.handleChange(event)
                            }}>
                        <option value=""></option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                    <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Criminal History:</label>
                    <select style={{width: "60px", height: "27px", margin: "10px"}} name="criminalHistory"
                            onChange={(event) => {
                                this.handleChange(event)
                            }}>
                        <option value=""></option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
            </div>
            <h4 style={{marginTop: "15px"}}>Residential Information</h4>
            <div>
                <div style={{ //title div
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px"
                }}>
                    <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Village Name:</label>
                    <Select style={{width: "200px", margin: "10px"}} value={this.state.villageValue} id="getVillage" className="dropdown" onChange={(option) => {this.handleDropdownMulti(option, "village")}} name="village"
                            options={this.state.villages}/>
                    <label style={{paddingRight: "0px", paddingLeft: "10px"}}>House Number:</label>
                    <input style={{width: "150px", margin: "10px"}} type="text" className="form-control"
                           placeholder="House Number" name="house"
                           onChange={this.handleChange}/>
                    <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Entry Date:</label>
                    <input style={{width: "175px", margin: "10px"}} type="date" className="form-control"
                           name="startDate"
                           onChange={this.handleChange}/>
                </div>
                <div style={{ //title div
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px"
                }}>
                    <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Last Known Residence:</label>
                    <input style={{width: "250px", margin: "10px"}} type="text" className="form-control"
                           name="pastResidence"
                           onChange={this.handleChange}/>
                    <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Previous Shelter Program:</label>
                    <input style={{width: "250px", margin: "10px"}} type="text" className="form-control"
                           name="pastShelter"
                           onChange={this.handleChange}/>
                </div>
            </div>
            <Button style={{margin: "15px"}} size="md" type="submit" className="btn btn-primary" value="Submit">Submit
                Resident</Button>
        </form>)
    }
}


class UploadResidents extends Component {


  mySubmitHandler = (e) => {
    this.props.fileUpdate(false);
    e.preventDefault();
    let form = document.getElementById("bulkResidentUpload")
    let formData = new FormData()
    formData.append('fileName', document.getElementById("fileName").files[0])
    fetch(serverHost + "/sendFile", {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
        },
        body : formData
    }).then((response) => {
        if (response.status === 400) {
            response.json()
                .then((text) => {
                    alert(text.error);
                });
        } else if (response.status === 201) {
            form.reset();
            this.props.fileUpdate(true);
        }
    })
  }

  render() {
    return (
      <div>
        <h4 style={{marginTop: "15px"}}>Bulk Resident Upload</h4>
        <p style={{fontSize: "large"}}>Please use this form to upload more than one resident at a time. Only .xlsx Excel files are accepted.</p>
        <form id="bulkResidentUpload" name="myForm" onSubmit={this.mySubmitHandler}>
                                  <input id="fileName" name="fileName" type="file"  className="validate" />
                                  <input className="btn btn-primary" type="submit" value="Submit File"/>
        </form>
      </div>
    )

  }

}