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
            <div style={{marginLeft: "30px"}}>
              <Link to="/residentdirectory"><Button style={{margin: "10px"}} size="sm" variant="secondary" onClick={() => {this.setState({addedResident: false})}}>Back</Button></Link>
                {this.state.addedResident === true ? <div className="alert alert-success alert-dismissible fade show" role="alert">
                Successfully added resident!
                  <button type="button" className="close" aria-label="Close" onClick={() => {this.setState({addedResident: false})}}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div> : <div />}
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
        startDate: ""    
    };
  }

  handleChange = (event) => {
      let nam = event.target.name;
      let val = event.target.value;
      this.setState({[nam]: val});
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
        this.state.startDate === "") {
          alert("All fields are required");
    } else {
      let data = {
        fName: this.state.firstName,
        lName: this.state.lastName,
        birthday: this.state.birthday,
        village: this.state.village,
        house: this.state.house,
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
          <input style={{width: "300px", margin: "10px"}} type="text" className="form-control" placeholder="House Number" name="house"
                 onChange={this.handleChange}/>
          <label>Entry Date:</label>
          <input style={{width: "300px", margin: "10px"}} type="date" className="form-control" name="startDate" onChange={this.handleChange}/>
      </div>
      <Button style={{margin: "10px"}} size="md" type="submit" className="btn btn-primary" value="Submit">Add Resident</Button>
  </form>)

  }
}
