import MaterialTable from "material-table";
import React, { Component } from "react";
import { tableIcons } from "./UsersFragment";
import { firestore } from "../firebase";
import Refresh from "@material-ui/icons/Refresh";


// var data = require('../users.json');

export class CitiesFragment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: [],
    };
  }

  componentDidMount() {
    this.getCities();
  }

  render() {
    return (
      <div>
        <MaterialTable
          icons={tableIcons}
          title="Cities"
          columns={[
            { title: "City", field: "city", editable: "onAdd" },
            { title: "Pincode's", field: "pincodes" },
            { title: "Lat-Long", field: "lat_long", editable: "onAdd" },
            { title: "Status", field: "active", lookup: ["Enable", "Disable"] },
          ]}
          data={this.state.cities}
          options={{
            headerStyle: {
              position: "sticky",
              top: 0,
              fontSize: 18,
              backgroundColor: '#EEE',
            },
          }}
          actions={[
            {
              icon: Refresh,
              tooltip: 'Refresh Data',
              isFreeAction: true,
              onClick: () => this.getCities(),
            }
          ]}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                newData.id = firestore.collection("cities").doc().id;
                newData.active = false;
                firestore.collection("cities").doc(newData.id).set(newData);
                setTimeout(() => {
                  resolve();
                  this.getCities();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                newData.active = newData.active == "0" ? true : false;
                firestore.collection("cities").doc(newData.id).set(newData);
                setTimeout(() => {
                  resolve();
                  this.getCities();
                }, 1000);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                firestore.collection("cities").doc(oldData.id).delete();
                setTimeout(() => {
                  resolve();
                  this.getCities();
                }, 1000);
              }),
          }}
        />
      </div>
    );
  }

  getCities() {
    let retailersData = [];
    firestore.collection("cities").onSnapshot((snap) => {
      snap.forEach((doc) => {
        let retailer = doc.data();
        retailer.active = retailer.active ? "0" : "1";
        retailersData.push(retailer);
      });
      this.setState({
        cities: retailersData,
      });
    });
  }
}

export default CitiesFragment;
