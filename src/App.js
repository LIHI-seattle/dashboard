import React, {Component} from 'react';
import IncidentReport from './IncidentReport'
import ResidentDirectory from './ResidentDirectory'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
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
            <div>
                {!this.state.incRep && !this.state.resDir && <div style={{ //title div
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
                </div>
            </div>
        );

    }
}

export default App;
