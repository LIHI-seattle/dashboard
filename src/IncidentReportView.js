import React, {Component} from "react";
import Select from "react-select";

class IncidentReportView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            incident: [],
            displayIncRep: false
        };
    }

    componentDidMount() {
        this.reupdateData();
    }

    handleChange = (event) => {
        console.log(event)
        this.setState({
            value: event.label,
            incidentObj: event.data,
            displayIncRep: true
        });
    };

    reupdateData = () => {
        fetch("http://localhost:4000/incidentReport/" + this.props.personID, /*{
            body: JSON.stringify(data),
            mode: 'cors',
            headers: {
                'Accept': 'application/json, text/plain, *!/!*',
                'Content-Type': 'application/json'
            },
            method: "get"
        }*/)
            .then((res) => {
                if (res.ok) {
                    return res.text();
                } else {
                    throw new Error(res.message);
                }
            })
            .then((data) => {
                let incidents = JSON.parse(data);
                this.setState({incident: incidents})
                console.log(this.state.incident)
            })
            .catch((error) => {
                console.log(error)
            });
    };


    render() {
        return (
            <div>
                <div>
                    <label>Incident Reports for {this.props.personName}</label>
                    <Select id="resident-options" size="lg" className="dropdown" onChange={this.handleChange}
                            options={this.state.incident.map((item) => ({
                                label: "Incident: " + new Date(item.INCIDENT_DATE).toLocaleDateString(),
                                data: item
                            }))}
                    />
                </div>

                {this.state.displayIncRep &&
                <div>
                    <div className ="form-row">
                        <div className="form-group col-md-3">
                            <p>Date of Incident: {new Date(this.state.incidentObj.INCIDENT_DATE).toDateString()}</p>
                        </div>
                        <div className="form-group col-md-3">
                            <p>Time of Incident: {this.state.incidentObj.TIME}</p>
                        </div>
                        <div className="form-group col-md-3">
                            <p>Village: {this.state.incidentObj.VID}</p>
                        </div>
                        <div className="form-group col-md-3">
                            <p>Location: {this.state.incidentObj.LOCATION}</p>
                        </div>
                    </div>
                    <div className = "form-row">
                        <div className="form-group col-md-4">
                            <p>People Involved: ??</p>
                        </div>
                        <div className="form-group col-md-4">
                            <p>Observers of the Incident: ??</p>
                        </div>
                    </div>
                    <div className="form-group col-md-11">
                        <p>Describe the Incident {this.state.incidentObj.DESCRIPTION}</p>
                    </div>
                    <div className="form-row">
                        <p>Did the incident involve an injury to the resident, staff, or others? {this.state.incidentObj.INJURY} [boolean]</p>
                    </div>
                    <div className="form-group col-md-11">
                        <p>Describe any injuries, physical complaints, or property damage. If no injuries, type "NA". : {this.state.incidentObj.INJURY_DESCRIPTION}</p>
                    </div>
                    <div className = "form-row">
                        <div className="form-group col-md-3">
                            <p>Was an Emergency Room visit required? : {this.state.incidentObj.ER_VISIT}</p>
                        </div>
                        <div className="form-group col-md-9">
                           <p>If YES an emergency room was visited, which hospital? If no, type 'NA': {this.state.incidentObj.ER_HOSPITAL}</p>
                        </div>
                    </div>
                    <div className = "form-row">
                        <div className="form-group col-md-3">
                            <p>Was a police report filed?: {this.state.incidentObj.POLICE_REPORT}</p>
                        </div>
                        <div className="form-group col-md-9">
                         <p>If YES a police report was filed, what was the report number? If no, type 'NA' : {this.state.incidentObj.PR_NUMBER}</p>
                        </div>
                    </div>
                    <div className="form-row">
                        <p>Which individuals or supervisors were notified? ??</p>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                           <p>Report Logged By: {this.state.incidentObj.AUTHOR_ID} on {new Date(this.state.incidentObj.AUTHOR_DATE).toDateString()}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-11">
                        <p>Summarize your follow up action and recommendations: ??</p>
                    </div>
                    <div className="form-row">
                        <p>Report reviewed by: {this.state.incidentObj.REVIEWER_ID}</p>
                    </div>
                </div>
                }
            </div>
        );
    }
}

export default IncidentReportView;