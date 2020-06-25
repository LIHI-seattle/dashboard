import React, {Component} from 'react';
import './IncidentReport.css'
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import { Link} from 'react-router-dom';


class IncidentReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            people: [],
            villages: [],
            incidentDate: "",
            time: "",
            village: "",
            location: "",
            peopleInvolved: [],  
            description: "",
            observers: [],  
            injury: "",
            injuryDescription: "",
            emergencyRoom: "",
            hospital: "",
            policeReport: "",
            reportNumber: "",
            peopleNotified: [],
            signature: "",
            currentDate: "",
            followUp: "",
            reviewerName: "",
            addedIncidentReport: false
        };
    }

    updateIncidentStatus = (status) => {
      this.setState({addedIncidentReport: status});
    }

    componentDidMount() {
      this.getPeople();
      this.getVillages();
      console.log(this.state.residents);
      console.log(this.state.villages);
    }

    getPeople = () =>{
        fetch("http://localhost:4000/people")
            .then((res) => {
                if (res.ok) {
                    return res.text();
                } else {
                    throw new Error(res.message);
                }
            })
            .then((data) => {
                let residentArray = JSON.parse(data);
                this.setState({ people: residentArray})
            })
            .catch((error) => {
                console.log(error)
            });
    };

    getVillages = () =>{
      fetch("http://localhost:4000/villages")
          .then((res) => {
              if (res.ok) {
                  return res.text();
              } else {
                  throw new Error(res.message);
              }
          })
          .then((data) => {
              let villageArray = JSON.parse(data);
              this.setState({ villages: villageArray})
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

    handleDropdownChange = (event, name) => {
      let val = event.value;  
      this.setState({[name]: val})
    }

    handleDropdownAdd = (event, name) => {
      if (event) {
        let val = [];
        event.forEach(person => val.push(person.value));
        let stateVal = this.state[name];
        stateVal = val;
        this.setState({[name]: stateVal});
      } else {
        this.setState({[name]: []});
      }
    }

    mySubmitHandler = (e) => {
        e.preventDefault();
        let update = this.updateIncidentStatus;
        this.updateIncidentStatus(false);
        var form = document.getElementById("addIncident");
        // send json object
        if (this.state.incidentDate === "" ||
            this.state.time === "" ||
            this.state.village === "" ||
            this.state.location === "" ||
            this.state.description === "" ||
            this.state.observers === [] ||
            this.state.peopleInvolved === [] ||
            this.state.injury === "" ||
            this.state.injuryDescription === "" ||
            this.state.emergencyRoom === "" ||
            this.state.hospital === "" ||
            this.state.policeReport === "" ||
            this.state.reportNumber === "" ||
            this.state.peopleNotified === [] ||
            this.state.signature === "" ||
            this.state.currentDate === "" ||
            this.state.followUp === "" ||
            this.state.reviewerName === "") {
              alert("All fields are required");
        } else {
          let data = {incidentDate: this.state.incidentDate,
            time: this.state.time,
            village: this.state.village,
            location: this.state.location,
            peopleInvolved: this.state.peopleInvolved,  
            description: this.state.description,
            observers: this.state.observers,  
            injury: this.state.injury,
            injuryDescription: this.state.injuryDescription,
            emergencyRoom: this.state.emergencyRoom,
            hospital: this.state.hospital,
            policeReport: this.state.policeReport,
            reportNumber: this.state.reportNumber,
            peopleNotified: this.state.peopleNotified,
            signature: this.state.signature,
            currentDate: this.state.currentDate,
            followUp: this.state.followUp,
            reviewerName: this.state.reviewerName}
          fetch("http://localhost:4000/incidentReport", {
              body: JSON.stringify(data),
              mode: 'cors',
              headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
              },
              method: "post"
          }).then(function(response) {
              if (response.status === 400) {
                  response.json()
                  .then((text) => {
                      alert(text.error);
                  });
              } else {
                form.reset();
                update(true);
              }
          });
        }
        
    }

    back = () => {
      this.props.onBack()
    };

    addPersonInvolved = () => {
      this.setState({peopleInvolved: [...this.state.peopleInvolved, ""]})
    }
    
    addObserver = () => {
      this.setState({observers: [...this.state.observers, ""]})
    }
    render() {
        return (
          <div style={{marginLeft: "20px", marginRight: "20px"}}>
              <Link to='/'><Button style={{marginTop: "20px", marginBottom: "20px"}} size="sm" variant="secondary" >Back</Button></Link>
              {this.state.addedIncidentReport === true ? <div className="alert alert-success alert-dismissible fade show" role="alert">
                Successfully added incident!
                  <button type="button" className="close" aria-label="Close" onClick={() => {this.setState({addedIncidentReport: false})}}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div> : <div />}
              <div style={{ //title div
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <h1>Incident Report</h1>
                    </div>
            <form id="addIncident" onSubmit={this.mySubmitHandler}>
              <div className ="form-row">
                <div className="form-group col-md-3">
                  <label>Date of Incident<span className="required">*</span></label>
                  <input type="date" className="form-control" placeholder="MM/DD/YYYY" name="incidentDate" onChange={this.handleChange} />
                </div>
                <div className="form-group col-md-3">
                  <label>Time of Incident<span className="required">*</span></label>
                  <input type="time" className="form-control" placeholder="Ex: 11:45 AM" name="time" onChange={this.handleChange} /> 
                </div>
                <div className="form-group col-md-3">
                  <label>Village<span className="required">*</span></label>
                  <Select className="dropdown" onChange={(event) => {this.handleDropdownChange(event, "village")}} name="village"
                                options={this.state.villages.map((item) => ({label: item.NAME,
                                                                             value: item.VID}))}/>
                </div>
                <div className="form-group col-md-3">
                  <label>Location<span className="required">*</span></label>
                  <input type="text" className="form-control" name="location" onChange={this.handleChange} /> 
                </div>
              </div>
              <div className = "form-row">
                <div className="form-group col-md-4">
                  <label>People Involved<span className="required">*</span></label>
                  <Select isMulti className="dropdown" onChange={(event) => {this.handleDropdownAdd(event, "peopleInvolved")}} name="peopleInvolved"
                                options={this.state.people.map((item) => ({label: item.FIRST_NAME + " " + item.LAST_NAME,
                                                                              value: item.PID}))}/>
                </div>
                <div className="form-group col-md-4">
                  <label>Observers of the Incident<span className="required">*</span></label>
                  <Select isMulti className="dropdown" onChange={(event) => {this.handleDropdownAdd(event, "observers")}} name="observers"
                                options={this.state.people.map((item) => ({label: item.FIRST_NAME + " " + item.LAST_NAME,
                                                                              value: item.PID}))}/>
                </div>
              </div>
              <div className="form-group col-md-11">
                <label>Describe the Incident<span className="required">*</span></label>
                <textarea type="text" className="form-control" placeholder="In your own words explain what happened. Report only facts." name="description" onChange={this.handleChange} />
              </div>
              <div className="form-row">
                <label>Did the incident involve an injury to the resident, staff, or others?<span className="required">*</span></label>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="injury" value="true" id="injuryYes" onChange={this.handleChange}/>
                  <label className="form-check-label" id="injuryYes">Yes</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="injury" value="false" id="injuryNo" onChange={this.handleChange}/>
                  <label className="form-check-label" id="injuryNo">No</label>
                </div>
              </div>
              <div className="form-group col-md-11">
                <label>Describe any injuries, physical complaints, or property damage. If no injuries, type "NA".</label>
                <textarea type="text" className="form-control" placeholder="Describe Injuries Here" name="injuryDescription" onChange={this.handleChange} />
              </div>
              <div className = "form-row">
                <div className="form-group col-md-3">
                  <label>Was an Emergency Room visit required?<span className="required">*</span></label>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="emergencyRoom" value="true" id="emergencyRoomYes" onChange={this.handleChange}/>
                    <label className="form-check-label" id="emergencyRoomYes">Yes</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="emergencyRoom" value="false" id="emergencyRoomNo" onChange={this.handleChange}/>
                    <label className="form-check-label" id="emergencyRoomNo">No</label>
                  </div>
                </div>
                <div className="form-group col-md-9">
                  <input type="text" className="form-control" placeholder="If YES an emergency room was visited, which hospital? If no, type 'NA'" name="hospital" onChange={this.handleChange} />
                </div>
              </div>
              <div className = "form-row">
                <div className="form-group col-md-3">
                  <label>Was a police report filed?<span className="required">*</span></label>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="policeReport" value="true" id="policeReportYes" onChange={this.handleChange}/>
                    <label className="form-check-label" id="policeReportYes">Yes</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="policeReport" value="false" id="policeReportNo" onChange={this.handleChange}/>
                    <label className="form-check-label" id="policeReportNo">No</label>
                  </div>
                </div>
                <div className="form-group col-md-9">
                  <input type="text" className="form-control" placeholder="If YES a police report was filed, what was the report number? If no, type 'NA'" name="reportNumber" onChange={this.handleChange} />
                </div>
              </div>
              <div className="form-row">
                <label>Which individuals or supervisors were notified?<span className="required">*</span></label>
                <Select isMulti className="dropdown" onChange={(event) => {this.handleDropdownAdd(event, "peopleNotified")}} name="peopleNotified"
                                options={this.state.people.map((item) => ({label: item.FIRST_NAME + " " + item.LAST_NAME,
                                                                              value: item.PID}))}/>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Type your full name, electronically giving your signature that all of this information is accurate to the best of your knowledge<span className="required">*</span></label>
                  <Select placeholder="Electronic signature here" className="dropdown" onChange={(event) => {this.handleDropdownChange(event, "signature")}} name="signature"
                                options={this.state.people.map((item) => ({label: item.FIRST_NAME + " " + item.LAST_NAME,
                                                                             value: item.PID,}))}/>
                </div>
                <div className="form-group col-md-6">
                  <label>Today's Date<span className="required">*</span></label>
                  <input type="date" className="form-control" placeholder="MM/DD/YYYY" name="currentDate" onChange={this.handleChange} />
                </div>
              </div>
              <div className="form-group col-md-11">
                <label>Summarize your follow up action and recommendations<span className="required">*</span></label>
                <textarea type="text" className="form-control" name="followUp" onChange={this.handleChange} />
              </div>
              <div className="form-row">
                <label>Have another person review the document and state their name here<span className="required">*</span></label>
                <Select className="dropdown" onChange={(event) => this.handleDropdownChange(event, "reviewerName")} name="reviewerName"
                                options={this.state.people.map((item) => ({label: item.FIRST_NAME + " " + item.LAST_NAME,
                                                                              value: item.PID}))}/>
              </div>
              <Button style={{margin: "10px"}} size="md" type="submit" className="btn btn-primary" value="Submit">Submit Incident Report</Button>
            </form>
          </div>
        );
    }
}

export default IncidentReport;