import React, {Component} from 'react';
import IncidentReport from './IncidentReport'
import ResidentDirectory from './ResidentDirectory'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import AddResident from './AddResident';
import { BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resDir: false,
            incRep: false,
        };
    }

    componentDidMount() {
        this.setState({residents: [
                { label: "Alligators", value: 1 },
                { label: "Crocodiles", value: 2 },
                { label: "Sharks", value: 3 },
                { label: "Small crocodiles", value: 4 },
                { label: "Smallest crocodiles", value: 5 },
                { label: "Snakes", value: 6 },
            ]})
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
