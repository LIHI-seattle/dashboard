import React, {Component} from 'react';
import Select from 'react-select';
import './ResidentDirectory.css'

//https://www.youtube.com/watch?v=KItsR6pM5lY
class ResidentDirectory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '?',
            displayCard: false
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

    handleChange = (event) => {
        this.setState({
            value: event.label,
            displayCard: true
        });
        console.log(event.label)
    };

    render() {
        return (
            //search bar that grabs data from server and filters

            //on select of a certain option then a card of the person image + other info displayed
            <div>
                <button onClick={this.back}>Back</button>
                <h1>Resident Directory</h1>

                <div>
                    <Select className="dropdown" options={this.props.residents} onChange={this.handleChange}/>
                    <button className="add_button" onClick={this.onRoomClick}>Add a Resident</button>
                    <button onClick={this.onRoomClick}>Remove a Resident</button>
                </div>

                {this.state.displayCard &&
                <p>{this.state.value}</p>
                }

                {/*<Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the bulk of
                            the card's content.
                        </Card.Text>
                        <Button variant="primary">Go somewhere</Button>
                    </Card.Body>
                </Card>*/}

            </div>
        );
    }
}

export default ResidentDirectory;