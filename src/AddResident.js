import React, {Component} from 'react';
import Button from "react-bootstrap/Button";
import { Link} from 'react-router-dom';


export default class AddResident extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addedResident: false,
        };
    }

    updateResidentStatus(status) {
      this.setState({addedResident: status});
    }

    render() {
        return (
            <div style={{marginLeft: "20px", marginRight: "20px"}}>
              <Link to="/residentdirectory"><Button style={{marginTop: "20px", marginBottom: "20px"}} size="sm" variant="secondary" onClick={() => {this.setState({addedResident: false})}}>Back</Button></Link>
                {this.state.addedResident === true ? <div className="alert alert-success alert-dismissible fade show" role="alert">
                Successfully added resident!
                  <button type="button" className="close" aria-label="Close" onClick={() => {this.setState({addedResident: false})}}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div> : <div />}
                <div style={{ //title div
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <h1>Add Resident</h1>
                    </div>
                <p>Please fill out the following information for the resident you wish to add.</p>
                <AddResidentForm residentUpdate={this.updateResidentStatus.bind(this)} />
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

  handleChange = (event) => {
      let name = event.target.name;
      let value = event.target.value;
      this.setState({[name]: value});
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
      fetch("http://localhost:4000/residents", {
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
    return (<form id="addResident" onSubmit={(e) => {this.mySubmitHandler(e)}}>
      <h5>Personal Information</h5>
      <div id="addresidentform" style={{ //title div
          display: "flex",
          alignItems: "center",
          marginLeft: "10px"
          }}>
          <label style={{paddingRight: "0px", paddingLeft: "10px"}}>First Name<span className="required">*</span></label>
          <input style={{width: "200px", margin: "10px"}} type="text" className="form-control"
                 placeholder="First Name" name="firstName"
                 onChange={this.handleChange}/>
          <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Last Name<span className="required">*</span></label>
          <input style={{width: "200px", margin: "10px"}} type="text" className="form-control"
                 placeholder="Last Name" name="lastName"
                 onChange={this.handleChange}/>
          <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Birthday<span className="required">*</span></label>
          <input style={{width: "175px", margin: "10px"}} type="date" className="form-control"
                 placeholder="MM/DD/YYYY" name="birthday"
                 onChange={this.handleChange}/>
          <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Gender<span className="required">*</span></label>
          <input style={{width: "125px", margin: "10px"}} type="text" className="form-control"
                 placeholder="e.g. M, F" name="gender"
                 onChange={this.handleChange}/>
          <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Employment<span className="required">*</span></label>
          <select style={{width: "60px", height: "27px", margin: "10px"}} name="employment" onChange={(event) => {this.handleChange(event)}}>
            <option value=""></option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Identification<span className="required">*</span></label>
          <select style={{width: "60px", height: "27px", margin: "10px"}} name="identification" onChange={(event) => {this.handleChange(event)}}>
            <option value=""></option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Last Known Residence</label>
          <input style={{width: "250px", margin: "10px"}} type="text" className="form-control" name="pastResidence"
                 onChange={this.handleChange}/>
          <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Disability<span className="required">*</span></label>
          <select style={{width: "60px", height: "27px", margin: "10px"}} name="disabilities" onChange={(event) => {this.handleChange(event)}}>
            <option value=""></option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Children<span className="required">*</span></label>
          <select style={{width: "60px", height: "27px", margin: "10px"}} name="children" onChange={(event) => {this.handleChange(event)}}>
            <option value=""></option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Previous Shelter Program</label>
          <input style={{width: "250px", margin: "10px"}} type="text" className="form-control" name="pastShelter"
                 onChange={this.handleChange}/>         
          <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Criminal History<span className="required">*</span></label>
          <select style={{width: "60px", height: "27px", margin: "10px"}} name="criminalHistory" onChange={(event) => {this.handleChange(event)}}>
            <option value=""></option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>                                        
      </div>
      <h5>Residential Information</h5>
      <div style={{ //title div
          display: "flex",
          alignItems: "center",
          marginLeft: "10px"
      }}>
          <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Village Name<span className="required">*</span></label>
          <input style={{width: "200px", margin: "10px"}} type="text" className="form-control" placeholder="Village Name" name="village"
                 onChange={this.handleChange}/>
          <label style={{paddingRight: "0px", paddingLeft: "10px"}}>House Number<span className="required">*</span></label>
          <input style={{width: "150px", margin: "10px"}} type="text" className="form-control" placeholder="House Number" name="house"
                 onChange={this.handleChange}/>
          <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Entry Date<span className="required">*</span></label>
          <input style={{width: "175px", margin: "10px"}} type="date" className="form-control" name="startDate" onChange={this.handleChange}/>
      </div>
      <Button style={{margin: "10px"}} size="md" type="submit" className="btn btn-primary" value="Submit">Add Resident</Button>
  </form>)

  }
}
