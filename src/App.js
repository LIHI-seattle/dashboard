import React, {Component} from 'react';
import IncidentReport from './IncidentReport'
import ResidentDirectory from './ResidentDirectory'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import AddResident from './AddResident';
import { BrowserRouter as Router, Route, Switch, Redirect, Link} from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resDir: false,
            incRep: false,
        };
    }

    onRoomClick = () => {
        this.setState({incRep: true})
    };

    onResClick = () => {
        this.setState({resDir: true})
    };

    onBackClick = () => {
        this.setState({incRep: false, resDir: false})
    };

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" exact component={HomePage}/>
                    <Route path='/addresident' component={AddResident} />
                    <Route path='/residentdirectory' component={ResidentDirectory} />
                    <Route path='/incidentreport' component={IncidentReport}/>
                </Switch>
            </Router>
            
        );

    }
}

class HomePage extends Component {
    render() {
        return (
            <div>
                {/* {!this.state.incRep && !this.state.resDir && <div style={{ //title div
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                    marginTop: "240px"
                }}>
                    <h1>Welcome to the LiHi Information Database</h1>
                </div>}
                <div>
                    {!this.state.incRep && !this.state.resDir &&
                    <Button style={{padding: "10px", marginLeft: "500px", marginTop: "10px"}} className='mr-5' size="lg" onClick={this.onRoomClick}>Add an Incident</Button>}
                    {!this.state.incRep && !this.state.resDir &&
                    <Button style={{padding: "10px", marginTop: "10px"}} size="lg" onClick={this.onResClick}>Resident Directory</Button>}
                    {this.state.incRep && <IncidentReport onBack={this.onBackClick}/>}
                    {console.log(this.state.resDir)}
                    {this.state.resDir && <ResidentDirectory onBack={this.onBackClick}/>}
                </div> */}
                <div style={{ //title div
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                    marginTop: "240px"
                }}>
                    <h1>Welcome to the LiHi Information Database</h1>
                </div>           
                <div id="homebuttons">
                    <Link to="/incidentreport">
                        <Button  className='mr-5' size="lg" >
                            <span>Add An Incident</span>
                        </Button>
                    </Link>
                    <Link to="/residentdirectory">
                        <Button  size="lg">
                            <span>Resident Directory</span>
                        </Button>
                    </Link>
                    
                </div>     
            </div>
        );
    }
}

export default App;
