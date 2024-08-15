import React, { Component } from "react";
import { connect } from "react-redux";
import { Card, CardContent } from "@material-ui/core";
import { firestore, storage } from "../../firebase";
import CountUp from 'react-countup';


export class UserCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }

    }
    componentDidMount() {
        this.getCount();
    }
    render() {
        return (
            <Card style={{ width: '12rem', padding: 10, margin: 5, backgroundColor: "lightsteelblue" }}>
                <h3>Users</h3>
                <p style={{ fontSize: 25, fontWeight: "bolder", color: "white", alignItems: "center" }}><CountUp end={this.state.count} /></p>
            </Card>
        );
    }

    getCount() {
        var query = firestore
            .collection("users");
        query.get().then((snap) => {
            this.setState({
                count: snap.size,
            });
        });
    }
}

const mapStateToProps = (state) => {
    // console.log(state.user);
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(UserCard);
