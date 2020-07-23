import React, {Component} from 'react'
import Button from "react-bootstrap/Button";
import {Link} from 'react-router-dom';
import { serverHost } from './commons';

export default class AddVillage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addedVillage: false,
            villages: []
        };
    }


    updateVillageStatus(status) {
        this.setState({addedVillage: status});
    }

    render() {
        return(
            <div style={{marginLeft: "20px", marginRight: "20px"}}>
                <Link to="/"><Button style={{marginTop: "20px", marginBottom: "20px"}} size="sm"
                                                      variant="secondary" onClick={() => {
                    this.setState({addedVillage: false})
                }}>Back</Button></Link>
                {this.state.addedVillage === true ?
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        Successfully added village!
                        <button type="button" className="close" aria-label="Close" onClick={() => {
                            this.setState({addedVillage: false})
                        }}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div> : <div/>}
                <div style={{ //title div
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <h1>Add Village</h1>
                </div>
                
                <p style={{marginTop: "30px"}}>Please fill out the following information for the village you wish to add.</p>
                <AddVillageForm villageUpdate={this.updateVillageStatus.bind(this)} />
            </div>
        )
    }
}

class AddVillageForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            village: '',
            numHouses: '',
        };
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({[name]: value});
    }

    mySubmitHandler = (e) => {
        e.preventDefault();
        this.props.villageUpdate(false);

        var form = document.getElementById("addVillage");
        if (this.state.village === "" ||
            this.state.numHouses === "" ||
            isNaN(parseInt(this.state.numHouses))) {
            alert("All fields are required. Ensure number of houses is a valid integer.");
        } else {
            let data = {
                villageName: this.state.village,
                numHouses: this.state.numHouses
            }
            fetch(serverHost + "/villages", {
                body: JSON.stringify(data),
                mode: 'cors',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                method: "post"
            }).then((response) => {
                if (response.status === 400) {
                    response.json()
                        .then((text) => {
                            alert(text.error);
                        });
                } else if (response.status === 201) {
                    form.reset();
                    this.props.villageUpdate(true);
                    this.props.getVillages();
                }
            })
        }
    }

    render() {
        return(
            <form id="addVillage" onSubmit={(e) => {
                this.mySubmitHandler(e)
            }}>
                <h4 >Village Information</h4>
                <div id="addvillageform" style={{ //title div
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px"
                }}>
                    <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Name</label>
                    <input style={{width: "200px", margin: "10px"}} type="text" className="form-control"
                        placeholder="e.g. Interbay" name="village"
                        onChange={this.handleChange}/>
                    <label style={{paddingRight: "0px", paddingLeft: "10px"}}>Number of Houses</label>
                    <input style={{width: "200px", margin: "10px"}} type="text" className="form-control"
                        placeholder="e.g. 10, 20... " name="numHouses"
                        onChange={this.handleChange}/>
                </div>
                <Button style={{margin: "15px"}} size="md" type="submit" className="btn btn-primary" value="Submit">Add
                Village</Button>
            </form>
        )
    }
}
