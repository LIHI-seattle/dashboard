import React, {Component} from 'react';
import IncidentReport from './IncidentReport'
import ResidentDirectory from './ResidentDirectory'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import AddResident from './AddResident';
import AddVillage from './AddVillage';
import { BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';

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
                    <Route path='/addvillage' component={AddVillage}/>
                </Switch>
            </Router>
            
        );

    }
}


class HomePage extends Component {
    render() {
        return (
            <div>
                <div style={{ //title div
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                    marginTop: "240px",
                    marginBottom: "40px"
                }}>
                    <h1>Welcome to the LIHI Information Database</h1>
                </div>           
                <div id="homebuttons">
                    <Link style={{margin: "30px"}} to="/incidentreport">
                        <Button size="lg" >
                            <span>Add an Incident</span>
                        </Button>
                    </Link>
                    <Link style={{margin: "30px"}} to="/residentdirectory">
                        <Button  size="lg">
                            <span>Resident Directory</span>
                        </Button>
                    </Link>
                    <Link style={{margin: "30px"}} to="/addvillage">
                        <Button  size="lg">
                            <span>Add a Village</span>
                        </Button>
                    </Link>
                    <Link style={{margin: "30px"}} to="/addresident">
                        <Button className='add_button' size="lg">
                            <span>Add Resident</span>
                        </Button>
                    </Link>
                </div>     
            </div>
        );
    }
}

export default App;
