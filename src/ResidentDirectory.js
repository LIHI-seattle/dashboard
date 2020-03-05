import React, {Component} from 'react';
import Card from 'react-bootstrap/Button';

//https://www.youtube.com/watch?v=KItsR6pM5lY
class ResidentDirectory extends Component {
    render() {
        return (
            <div>
                {this.props.contacts.map((resident) => (
                <Card>
                    <Card.Img top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" />
                    <Card.Block>
                        <Card.Title>{resident.name}</Card.Title>
                        <Card.Subtitle>{resident.company}</Card.Subtitle>
                        <Card.Text>{resident.description}</Card.Text>
                    </Card.Block>
                </Card>
                        ))}
            </div>
        );
    }
}

export default ResidentDirectory;