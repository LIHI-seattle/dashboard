import React, {Component} from 'react';
import Select from 'react-select';
import './ResidentDirectory.css'
import AddRemoveResident from './AddRemoveResident.js'

//https://www.youtube.com/watch?v=KItsR6pM5lY
class ResidentDirectory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '?',
            displayCard: false,
            displayEditPage: false
        };
    }

    /*componentDidMount() { //can use this when we work with the server
        fetch('http://jsonplaceholder.typicode.com/users')
            .then(res => res.json())
            .then((data) => {
                this.setState({residents: data}) //as soon as comp is up and running will change state
            })
            .catch(console.log)
    }*/

    back = () => {
        this.props.onBack()
    };

    backToSearch = () => {
        this.setState({
            displayEditPage: false
        });
    };

    handleChange = (event) => {
        this.setState({
            value: event.label,
            displayCard: true
        });
        console.log(event.label)
    };

    addOrRemoveResident = (event) => {
        this.setState({
            displayEditPage: true
        });
        //reupdate data
    };

    render() {
        return (
            //search bar that grabs data from server and filters

            //on select of a certain option then a card of the person image + other info displayed
            <div>
                {!this.state.displayEditPage && //search bar page
                <div>
                    <button onClick={this.back}>Back</button>
                    <h1>Resident Directory</h1>

                    <div>
                        <Select className="dropdown" options={this.props.residents} onChange={this.handleChange}/>
                        <button className="add_button" onClick={this.addOrRemoveResident}>Add/Remove a Resident</button>
                    </div>

                    {this.state.displayCard &&
                    <p>{this.state.value}</p>
                    }
                </div>
                }

                {this.state.displayEditPage && //add resident page
                    <div>
                        <button onClick={this.backToSearch}>Back</button>
                        <AddRemoveResident/>
                    </div>
                }

            </div>

        );
    }
}

export default ResidentDirectory;