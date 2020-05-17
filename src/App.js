import React, {Component} from 'react';
import RoomTracker from './RoomTracker'
import ResidentDirectory from './ResidentDirectory'
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resDir: false,
            roomTrack: false,
            residents: []
        };
    }

    componentDidMount() {
        fetch("http://localhost:4000/residents")
        .then(res => res.text())
        .then((data) => {
            this.setState({ residents: JSON.parse(data)})
            console.log(this.state.residents)
        })
        .catch(console.log)
    }

    onRoomClick = () => {
        this.setState({roomTrack: true})
    };

    onResClick = () => {
        this.setState({resDir: true})
    };

    onBackClick = () => {
        this.setState({roomTrack: false, resDir: false})
    };

    render() {
        return (
            <div>
                {!this.state.roomTrack && !this.state.resDir && <h1>Welcome to the LiHi Information Database</h1>}
                {!this.state.roomTrack && !this.state.resDir &&
                <button value="RoomTracker" onClick={this.onRoomClick}>Add an Incident</button>}
                {!this.state.roomTrack && !this.state.resDir &&
                <button value="ResidentDirectory" onClick={this.onResClick}>Resident Directory</button>}
                {this.state.roomTrack && <RoomTracker onBack={this.onBackClick}/>}
                {console.log(this.state.resDir)}
                {this.state.resDir && <ResidentDirectory onBack={this.onBackClick} residents={this.state.residents}/>}
                <div>
                    <h1>My Residents</h1>
                    {this.state.residents.map((residents) => (
                        <div>
                            <h5>{residents.NAME}</h5>
                        </div>
                    ))}
                </div>
            </div>
        );

    }
}

export default App;
