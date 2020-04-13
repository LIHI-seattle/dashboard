import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

//https://www.youtube.com/watch?v=KItsR6pM5lY
class ResidentDirectory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: []
        };
    }

    componentDidMount() {
        fetch('http://jsonplaceholder.typicode.com/users')
            .then(res => res.json())
            .then((data) => {
                this.setState({contacts: data}) //as soon as comp is up and running will change state
            })
            .catch(console.log)
    }

    back = () => {
        this.props.onBack()
    };

    render() {
        return (
            //search bar that grabs data from server and filters
            //on select of a certain option then a card of the person image + other info displayed
            <div>
                <button onClick={this.back}>Back</button>
                <h1>Resident Directory</h1>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the bulk of
                            the card's content.
                        </Card.Text>
                        <Button variant="primary">Go somewhere</Button>
                    </Card.Body>
                </Card>
                {/*{this.state.contacts.map((resident) => (
                    <Card>
                        <Card.Img top width="100%"
                                  src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
                                  alt="Card image cap"/>
                        <Card.Block>
                            <Card.Title>{resident.name}</Card.Title>
                            <Card.Subtitle>{resident.description}</Card.Subtitle>
                            <Card.Text>{resident.description}</Card.Text>
                        </Card.Block>
                    </Card>
                ))}*/}
            </div>
        );
    }
}

export default ResidentDirectory;