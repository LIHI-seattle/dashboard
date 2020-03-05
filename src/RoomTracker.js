import React, {Component} from 'react';

class RoomTracker extends Component {
    render() {
        return (
            <div>
                <h1>Room Tracking System</h1>
                <h2> List of Available Rooms </h2>
                    {this.props.contacts.map((village) => ( //-- key={item} --> below in list... why?
                        // displaying lists https://www.robinwieruch.de/react-list-component
                        <div className="card">
                            <div className="card-body">
                                <h5 class="card-title">Village: {village.name}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">Building: {village.email}</h6> {/* will be come village.building */ }
                                <p className="card-text">Vacant Rooms: {village.company.catchPhrase}</p> {/* will be come village.building.rooms */ }
                                {/* consider how to display various rooms, later? */ }
                            </div>
                        </div>
                    ))}
            </div>
        );
    }
}

export default RoomTracker;