import React, {Component} from "react";

class IncidentReportView extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.reupdateData();
    }

    reupdateData = () => {
        console.log("reupdating data");
        fetch("http://localhost:4000/residents")
            .then((res) => {
                if (res.ok) {
                    return res.text();
                } else {
                    throw new Error(res.message);
                }
                // res.text();
            })
            .then((data) => {
                let residentArray = JSON.parse(data);
                this.setState({residents: residentArray})
                console.log(this.state.residents)
            })
            .catch((error) => {
                console.log(error)
            });
    };

    render() {
        return (
            <div>
                <p>hi</p>
            </div>
        );
    }
}

export default IncidentReportView;