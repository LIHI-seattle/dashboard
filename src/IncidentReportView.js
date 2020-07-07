import React, {Component} from "react";
import Select from "react-select";
import {Container, Row, Col} from 'reactstrap';

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
            //value: event.label,
            incidentObj: event.data,
            displayIncRep: true
        });
    };

    handleBool(bool){
        if (bool === 0){
            return "No"
        }
        return "Yes"
    }

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
                <div style={{ //title div
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <label>Incidents that {this.props.personName} was involved in: </label>
                    <Select id="resident-options" size="lg" className="dropdown" onChange={this.handleChange}
                            options={this.state.incident.map((item) => ({
                                label: "Incident on " + new Date(item.INCIDENT_DATE).toLocaleDateString(),
                                data: item
                            }))}
                    />
                </div>

                {this.state.displayIncRep &&
                <Container style={{marginTop: "30px"}}>
                    <Row>
                        <Col>
                            <p><strong>Date of Incident:</strong> {new Date(this.state.incidentObj.INCIDENT_DATE).toDateString()}</p>
                        </Col>
                        <Col>
                            <p><strong>Time of Incident:</strong> {this.state.incidentObj.TIME.substring(0,5)}</p>
                        </Col>
                        <Col>
                            <p><strong>Village:</strong> {this.state.incidentObj.VID}</p>
                        </Col>
                        <Col>
                            <p><strong>Location:</strong> {this.state.incidentObj.LOCATION}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>People Involved:</strong> ??</p>
                        </Col>
                        <Col>
                            <p><strong>Observers of the Incident:</strong> ??</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Description of the Incident:</strong> {this.state.incidentObj.DESCRIPTION}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Injury to the resident, staff, or
                                others?:</strong> {this.handleBool(this.state.incidentObj.INJURY)}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Description of injuries, physical complaints, or property damage:</strong> {this.state.incidentObj.INJURY_DESCRIPTION}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Emergency Room visit required?:</strong> {this.handleBool(this.state.incidentObj.ER_VISIT)}</p>
                        </Col>
                        <Col>
                            <p><strong>Hospital Name:</strong> {this.state.incidentObj.ER_HOSPITAL}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Police report filed?:</strong> {this.handleBool(this.state.incidentObj.POLICE_REPORT)}</p>
                        </Col>
                        <Col>
                            <p><strong>Report Number:</strong> {this.state.incidentObj.PR_NUMBER}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Individuals or Supervisors Notified:</strong> ??</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Report Logged By:</strong> {this.state.incidentObj.AUTHOR_ID} on {new Date(this.state.incidentObj.AUTHOR_DATE).toDateString()}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Follow up action and recommendations:</strong> ??</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Report reviewed by:</strong> {this.state.incidentObj.REVIEWER_ID}</p>
                        </Col>
                    </Row>
                </Container>
                }
            </div>
        );
    }
}

export default IncidentReportView;