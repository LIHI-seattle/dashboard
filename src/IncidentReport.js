import React, {Component} from 'react';
import './IncidentReport.css'
import Select from 'react-select';

class IncidentReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            residents: [],
            villages: [],
            incidentDate: "",
            time: "",
            village: "",
            location: "",
            peopleInvolved: "",  //will be array
            description: "",
            observers: "", // will be array
            injury: "",
            injuryDescription: "",
            emergencyRoom: "",
            hospital: "",
            policeReport: "",
            reportNumber: "",
            peopleNotified: "",
            signature: "",
            currentDate: "",
            followUp: "",
            reviewerName: ""
        };
    }

    componentDidMount() {
      this.getResidents();
    }

    getResidents = () =>{
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

    getVillages = () =>{
      console.log("reupdating data");
      fetch("http://localhost:4000/villages")
          .then((res) => {
              if (res.ok) {
                  return res.text();
              } else {
                  throw new Error(res.message);
              }
              // res.text();
          })
          .then((data) => {
              let villageArray = JSON.parse(data);
              this.setState({ villages: villageArray})
              console.log(this.state.villages)
          })
          .catch((error) => {
              console.log(error)
          });
    };

    handleChange = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    mySubmitHandler = () => {
        // send json object
        let data = {fName: this.state.firstName,
                    lName: this.state.lastName,
                    birthday: this.state.birthday,
                    village: this.state.village,
                    building: this.state.building,
                    room: this.state.room,
                    startDate: this.state.startDate}
        fetch("http://localhost:4000/residents", {
            body: JSON.stringify(data),
            mode: 'cors',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            method: "post"
        }).then(function(response) {
            if (response.status == 400) {
                response.json()
                .then((text) => {
                    alert(text.error);
                });
            }
            console.log(response.status);
            console.log(response);
        });
    }

    back = () => {
      this.props.onBack()
    };

    render() {
        return (
          <div>
            <button onClick={this.back}>Back</button>
            <h1>Incident Report</h1>
            <form onSubmit={this.mySubmitHandler}>
              <div className ="form-row">
                <div className="form-group col-md-3">
                  <label>Date of Incident</label>
                  <input type="date" className="form-control" placeholder="MM/DD/YYYY" name="incidentDate" onChange={this.handleChange} />
                </div>
                <div className="form-group col-md-3">
                  <label>Time of Incident</label>
                  <input type="text" className="form-control" placeholder="Ex: 11:45 AM" name="time" onChange={this.handleChange} /> 
                </div>
                <div className="form-group col-md-3">
                  <label>Village</label>
                  <Select className="dropdown" onChange={this.handleChange} name="village"
                                options={this.state.villages.map((item) => ({label: item.NAME}))}/>
                </div>
                <div className="form-group col-md-3">
                  <label>Location</label>
                  <input type="text" className="form-control" name="location" onChange={this.handleChange} /> 
                </div>
              </div>
              <div className = "form-row">
                <div className="form-group col-md-4">
                  <label>People Involved</label>
                  <Select className="dropdown" onChange={this.handleChange} name="peopleInvolved"
                                options={this.state.villages.map((item) => ({label: item.F_NAME + " " + item.L_NAME}))}/>
                </div>
                <div className="form-group col-md-4">
                  <label>Observers of the Incident</label>
                  <Select className="dropdown" onChange={this.handleChange} name="observers"
                                options={this.state.villages.map((item) => ({label: item.F_NAME + " " + item.L_NAME}))}/>
                </div>
              </div>
              <div className="form-group col-md-11">
                <label>Describe the Incident</label>
                <textarea type="text" className="form-control" placeholder="In your own words explain what happened. Report only facts." name="description" onChange={this.handleChange} />
              </div>
              <div className="form-row">
                <label>Did the incident involve an injury to the resident, staff, or others?</label>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="injury" value="Yes" id="injuryYes" onChange={this.handleChange}/>
                  <label className="form-check-label" id="injuryYes">Yes</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="injury" value="No" id="injuryNo" onChange={this.handleChange}/>
                  <label className="form-check-label" id="injuryNo">No</label>
                </div>
              </div>
              <div className="form-group col-md-11">
                <label>Describe any injuries, physical complaints, or property damage. If no injuries, type "NA".</label>
                <textarea type="text" className="form-control" placeholder="Describe Injuries Here" name="injuryDescription" onChange={this.handleChange} />
              </div>
              <div className = "form-row">
                <div className="form-group col-md-3">
                  <label>Was an Emergency Room visit required?</label>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="emergencyRoom" value="Yes" id="emergencyRoomYes" onChange={this.handleChange}/>
                    <label className="form-check-label" id="emergencyRoomYes">Yes</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="emergencyRoom" value="No" id="emergencyRoomNo" onChange={this.handleChange}/>
                    <label className="form-check-label" id="emergencyRoomNo">No</label>
                  </div>
                </div>
                <div className="form-group col-md-9">
                  <input type="text" className="form-control" placeholder="If YES an emergency room was visited, which hospital? If no, type 'NA'" name="hospital" onChange={this.handleChange} />
                </div>
              </div>
              <div className = "form-row">
                <div className="form-group col-md-3">
                  <label>Was a police report filed?</label>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="policeReport" value="Yes" id="policeReportYes" onChange={this.handleChange}/>
                    <label className="form-check-label" id="policeReportYes">Yes</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="policeReport" value="No" id="policeReportNo" onChange={this.handleChange}/>
                    <label className="form-check-label" id="policeReportNo">No</label>
                  </div>
                </div>
                <div className="form-group col-md-9">
                  <input type="text" className="form-control" placeholder="If YES a police report was filed, what was the report number? If no, type 'NA'" name="reportNumber" onChange={this.handleChange} />
                </div>
              </div>
              <div className="form-row">
                <label>Which individuals or supervisors were notified?</label>
                <input type="text" className="form-control" placeholder="Person Name" name="peopleNotified" onChange={this.handleChange} />
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Type your name, electronically giving your signature that all of this information is accurate to the best of your knowledge</label>
                  <input type="text" className="form-control" placeholder="Electronic Signature Here" name="signature" onChange={this.handleChange} />
                </div>
                <div className="form-group col-md-6">
                  <label>Today's Date</label>
                  <input type="date" className="form-control" placeholder="MM/DD/YYYY" name="currentDate" onChange={this.handleChange} />
                </div>
              </div>
              <div className="form-group col-md-11">
                <label>Summarize your follow up action and recommendations</label>
                <textarea type="text" className="form-control" name="followUp" onChange={this.handleChange} />
              </div>
              <div className="form-row">
                <label>Have another person review the document and state their name here</label>
                <input type="text" className="form-control" placeholder="Person Name" name="reviewerName" onChange={this.handleChange} />
              </div>
              <button type="submit" className="btn btn-primary" id="submitButton" value="Submit">Submit Incident Report</button>
            </form>
          </div>
        );
    }
}
/*
class IncidentReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: []
        };
    }

    componentDidMount() {
        fetch('http://jsonplaceholder.typicode.com/users')
            .then(res => res.json())
            .then((data) => {
                this.setState({contacts: data}) //as soon as comp is up and running will change state
            })
            .catch(console.log)
    }

    back = () => {
        this.props.onBack()
    };

    render() {
        return (
            <div>
                <button onClick={this.back}>Back</button>
                <h1>Room Tracking System</h1>
                <h2> List of Available Rooms </h2>
                {this.state.contacts.map((village) => ( //-- key={item} --> below in list... why?
                    // displaying lists https://www.robinwieruch.de/react-list-component
                    <div className="card">
                        <div className="card-body">
                            <h5 class="card-title">Village: {village.name}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Building: {village.email}</h6> {// will be come village.building }
                            <p className="card-text">Vacant
                                Rooms: {village.company.catchPhrase}</p> {// will be come village.building.rooms }
                            {// consider how to display various rooms, later? }
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}
*/
export default IncidentReport;