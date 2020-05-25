import React, {Component} from 'react';

export default class AddRemoveResident extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div>
                <AddResident reupdateData={this.props.reupdateData}/>
                <RemoveResident reupdateData={this.props.reupdateData}/>
            </div>
        )
    }
}

class AddResident extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            birthday: "",
            village: "",
            building: "",
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
        let data = {fName: this.state.firstName,
                    lName: this.state.lastName,
                    birthday: this.state.lastName,
                    village: this.state.village,
                    building: this.state.building,
                    room: this.state.room,
                    startDate: this.state.startDate}
        fetch("https://lihi-test-db.mysql.database.azure.com/residents", {
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            method: "post"
        }).then(function(response) {
            console.log(response.status);
            console.log(response);
            this.props.reupdateData(); 
            return response.json();
        });
        
    }
    
    render() {
        return (
          <form onSubmit={this.mySubmitHandler}>
            <div class ="form-row">
              <div class="form-group col-md-4">
                <label>First Name</label>
                <input type="text" class="form-control" placeholder="First Name" name="fName" onChange={this.handleChange} />
              </div>
              <div class="form-group col-md-4">
                <label>Last Name</label>
                <input type="text" class="form-control" placeholder="Last Name" name="lName" onChange={this.handleChange} /> 
              </div>
              <div class="form-group col-md-4">
                <label>Birthday</label>
                <input type="date" class="form-control" placeholder="MM/DD/YYYY" name="birthday" onChange={this.handleChange} /> 
              </div>
            </div>
            <div class ="form-row">
              <div class="form-group col-md-4">
                <label>Village</label>
                <input type="text" class="form-control" placeholder="Village Name" name="village" onChange={this.handleChange} />
              </div>
              <div class="form-group col-md-4">
                <label>Building</label>
                <input type="text" class="form-control" placeholder="Building Number" name="building" onChange={this.handleChange} /> 
              </div>
              <div class="form-group col-md-4">
                <label>Room Number</label>
                <input type="text" class="form-control" placeholder="Room Number" name="room"  onChange={this.handleChange} />
              </div>
            </div>
            <div class ="form-row"></div>
              <div class="form-group col-md-4">
                <label>Start Date</label>
                <input type="date" class="form-control" name="startDate" onChange={this.handleChange} />
              </div>
            <button type="submit" class="btn btn-primary" value="Submit">Add Resident</button>
          </form>
        );
      }

}


class RemoveResident extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            birthday: "",
            endDate: ""
        };
    }

    handleChange = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    mySubmitHandler = () => {
        // send json object
        let data = {fName: this.state.firstName,
                    lName: this.state.lastName,
                    birthday: this.state.lastName,
                    endDate: this.state.endDate}
        fetch("https://lihi-test-db.mysql.database.azure.com/residents", {
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            method: "delete"
        }).then(function(response) {
            console.log(response.status);
            console.log(response);
            return response.json();
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
              <label>
                  First Name:
                <input type="text" name="firstName" onChange={this.handleChange} />
              </label>
              <label>
                  Last Name:
                <input type="text" name="lastName" onChange={this.handleChange} /> 
              </label>
              <label>
                  Date of Birth:
                <input type="text" name="birthday" onChange={this.handleChange} /> 
              </label>
              <label>
                  End Date:
                <input type="text" name="endDate" onChange={this.handleChange} /> 
              </label>
              <input type="submit" value="Submit" />
            </form>
          );
    }
}