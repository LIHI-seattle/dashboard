import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'
import RoomTracker from './RoomTracker'
import ResidentDirectory from './ResidentDirectory'
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //contacts: [],
      resDir: false,
      roomTrack: false
    };
  }

  //api call: https://pusher.com/tutorials/consume-restful-api-react
 /* componentDidMount() {
    fetch('http://jsonplaceholder.typicode.com/users')
        .then(res => res.json())
        .then((data) => {
          this.setState({ contacts: data }) //as soon as comp is up and running will change state
        })
        .catch(console.log)
  }*/

  //routing stuff: https://www.kirupa.com/react/creating_single_page_app_react_using_react_router.htm
    onRoomClick = () => {
      this.setState({roomTrack: true} )
    };

    onResClick = () => {
        this.setState({resDir: true} )
    };

    onBackClick = () => {
        this.setState({roomTrack: false, resDir: false} )
    };

  render () {
      // switch statement idea from: https://stackoverflow.com/questions/54188654/how-to-load-a-new-component-on-button-click-in-reactjs
            return (
                <div>
                    {!this.state.roomTrack && !this.state.resDir && <h1>Welcome to the LiHi Information Database</h1> }
                    {!this.state.roomTrack && !this.state.resDir && <button value="RoomTracker" onClick={this.onRoomClick}>Room Tracker</button>}
                    {!this.state.roomTrack && !this.state.resDir && <button value="ResidentDirectory" onClick={this.onResClick}>Resident Directory</button>}
                    {this.state.roomTrack && <RoomTracker onBack={this.onBackClick} contacts={this.state.contacts}/>}
                    {console.log(this.state.resDir)}
                    {this.state.resDir && <ResidentDirectory onBack={this.onBackClick} contacts={this.state.contacts}/>}
                </div>
            );

    }
}

export default App;
