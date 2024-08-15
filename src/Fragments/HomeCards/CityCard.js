import React, { Component } from "react";
import { connect } from "react-redux";
import { Card, CardContent } from "@material-ui/core";
import { firestore, storage } from "../../firebase"
import CountUp from 'react-countup';


export class CityCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }


    }
    componentDidMount() {
        this.getCount();
    }
    getCount() {
        var query = firestore
            .collection("cities");
        query.get().then((snap) => {
            this.setState({
                count: snap.size,
            });
        });
    }
    render() {
        return (
            <Card style={{ width: '12rem', padding: 10, margin: 5, backgroundColor: "lightsalmon" }}>
                <h3>Cities</h3>
                <p style={{ fontSize: 25, fontWeight: "bolder", color: "white", alignItems: "center" }}><CountUp end={this.state.count} /></p>
            </Card>
        );
    }
}

const mapStateToProps = (state) => {
    // console.log(state.user);
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(CityCard);
