import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


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
                Village:
              <input type="text" name="village" onChange={this.handleChange} /> 
            </label>
            <label>
                Building:
              <input type="text" name="building" onChange={this.handleChange} /> 
            </label>
            <label>
                Room Number:
              <input type="text" name="room"  onChange={this.handleChange} /> 
            </label>
            <label>
                Start Date:
              <input type="date" name="startDate" onChange={this.handleChange} /> 
            </label>

            <input type="submit" value="Submit" />
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

    return() {
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