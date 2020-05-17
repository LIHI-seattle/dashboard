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
                <AddResident></AddResident>
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
        fetch("http://localhost:3001/residents", {
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            method: "post"
        }).then(function(response) {
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
                Birthday:
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

    return() {

    }
}