import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'
import RoomTracker from './RoomTracker'
import ResidentDirectory from './ResidentDirectory'
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      viewId: 0
    };
  }

  //api call: https://pusher.com/tutorials/consume-restful-api-react
  componentDidMount() {
    fetch('http://jsonplaceholder.typicode.com/users')
        .then(res => res.json())
        .then((data) => {
          this.setState({ contacts: data }) //as soon as comp is up and running will change state
        })
        .catch(console.log)
  }

  //routing stuff: https://www.kirupa.com/react/creating_single_page_app_react_using_react_router.htm
    onClick = (e) => {
      //console.log("/" + e.target.value + "/");
      //return  <Redirect  to={"/" + e.target.value} />
       return (<div>
           <ResidentDirectory contacts={this.state.contacts}/>
       </div>);

    }

  render () {
      // switch statement idea from: https://stackoverflow.com/questions/54188654/how-to-load-a-new-component-on-button-click-in-reactjs
            return (
                <div>
                    <h1>Welcome to the LiHi Information Database</h1>
                    <button value="RoomTracker" onClick={this.onClick}>Room Tracker</button>
                    <button value="ResidentDirectory" onClick={this.onClick}>Resident Directory</button>
                    <ResidentDirectory contacts={this.state.contacts}/>
                </div>
            );

    }
}

export default App;
