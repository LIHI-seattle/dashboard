import React, {Component} from "react";
import Select from "react-select";
import {Container, Row, Col} from 'react-bootstrap';

const colorStyles = {
    control: styles => ({...styles, backgroundColor: 'white'}),
    option: (styles) => {
        return {
            ...styles,
            backgroundColor: "white",
            color: 'black',
            cursor: 'default',
        };
    },
};

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
            incidentObj: event.data,
            displayIncRep: true
        });
    };

    handleBool(bool) {
        if (bool === 0) {
            return "No"
        }
        return "Yes"
    }

    reupdateData = () => {
        fetch("http://localhost:4000/incidentReport/" + this.props.personID)
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
                    alignItems: "center",
                    margin: "20px"
                }}>
                    <label>Incidents that {this.props.personName} was involved in:</label>
                    <Select id="resident-options" size="lg" className="dropdown" onChange={this.handleChange}
                            options={this.state.incident.map((item) => ({
                                label: "Incident on " + new Date(item.INCIDENT_DATE).toLocaleDateString(),
                                data: item
                            }))}
                            styles={colorStyles}
                    />
                </div>

                {this.state.displayIncRep &&
                <Container style={{marginTop: "30px", backgroundColor: '#f0f8ff', padding: "10px"}}>
                    <p><u>Incident Information</u></p>
                    <Row>
                        <Col>
                            <p><strong>Date of
                                Incident:</strong> {new Date(this.state.incidentObj.INCIDENT_DATE).toDateString()}</p>
                        </Col>
                        <Col>
                            <p><strong>Time of Incident:</strong> {this.state.incidentObj.TIME.substring(0, 5)}</p>
                        </Col>
                        <Col>
                            <p><strong>Village:</strong> {this.state.incidentObj.VILLAGE_NAME}</p>
                        </Col>
                        <Col>
                            <p><strong>Description of Location:</strong> {this.state.incidentObj.LOCATION}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>People Involved:</strong> {this.state.incidentObj.INVOLVED_NAMES}</p>
                        </Col>
                        <Col>
                            <p><strong>Observers of the Incident:</strong> {this.state.incidentObj.OBSERVER_NAMES}</p>
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
                            <p><strong>Description of injuries, physical complaints, or property
                                damage:</strong> {this.state.incidentObj.INJURY_DESCRIPTION}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Emergency Room visit
                                required?:</strong> {this.handleBool(this.state.incidentObj.ER_VISIT)}</p>
                        </Col>
                        <Col>
                            <p><strong>Hospital Name:</strong> {this.state.incidentObj.ER_HOSPITAL}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Police report
                                filed?:</strong> {this.handleBool(this.state.incidentObj.POLICE_REPORT)}</p>
                        </Col>
                        <Col>
                            <p><strong>Report Number:</strong> {this.state.incidentObj.PR_NUMBER}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Individuals or Supervisors
                                Notified:</strong> {this.state.incidentObj.NOTIFIED_NAMES}</p>
                        </Col>
                    </Row>
                    <p><u>Employee Information</u></p>
                    <Row>
                        <Col>
                            <p><strong>Report Logged By:</strong> {this.state.incidentObj.A_FNAME + " " + this.state.incidentObj.A_LNAME} on {new Date(this.state.incidentObj.AUTHOR_DATE).toDateString()}</p>
                        </Col>
                        <Col>
                            <p><strong>Author Signature:</strong> <i>{this.state.incidentObj.AUTHOR_SIG}</i></p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Follow up action and recommendations:</strong> {this.state.incidentObj.FOLLOW_UP}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Report reviewed
                                by:</strong> {this.state.incidentObj.R_FNAME + " " + this.state.incidentObj.R_LNAME}</p>
                        </Col>
                    </Row>
                </Container>
                }
            </div>
        );
    }
}

export default IncidentReportView;