import MaterialTable from "material-table";
import React, { Component } from "react";
import { tableIcons } from "./UsersFragment";
import Refresh from "@material-ui/icons/Refresh";
import { firestore, firebaseAuth } from "../firebase";

// var data = require('../users.json');

export class RetailersFragment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
    };
  }

  componentDidMount() {
    this.getCities();
    this.getAllRetailers();
  }

  render() {
    return (
      <div>
        <MaterialTable
          icons={tableIcons}
          title="Retailers"
          columns={[
            { title: "Full Name", field: "fullname" },
            { title: "Email", field: "email", editable: "onAdd" },
            { title: "Shop Name", field: "shopName" },
            {
              title: "City",
              field: "city",
              lookup: this.state.cities,
              editable: "onAdd",
            },
            { title: "Contact No", field: "contactNo" },
            { title: "Active", field: "active", lookup: ["Enabled", "Disabled"] },
          ]}
          actions={[
            {
              icon: Refresh,
              tooltip: 'Refresh Data',
              isFreeAction: true,
              onClick: () => this.getAllRetailers(),
            }
          ]}
          data={this.state.bookings}
          options={{
            headerStyle: {
              position: "sticky",
              top: 0,
              fontSize: 18,
              backgroundColor: '#EEE',
            },
            exportButton: true
          }}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                newData.cityId = this.state.cityData[parseInt(newData.city)].id;
                newData.city = this.state.cityData[parseInt(newData.city)].city;
                firebaseAuth
                  .createUserWithEmailAndPassword(newData.email, "pass@123")
                  .then(function (user) {
                    newData.active = false;
                    newData.role = "RETAILER";
                    newData.id = user.user.uid;
                    console.log(newData);
                    firestore
                      .collection("superusers")
                      .doc(newData.id)
                      .set(newData);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
                setTimeout(() => {
                  this.getAllRetailers();
                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                console.log(newData);
                newData.active = newData.active == "0" ? true : false;
                newData.cityId = this.state.cityData[parseInt(newData.city)].id;
                newData.city = this.state.cityData[parseInt(newData.city)].city;
                firestore.collection("superusers").doc(newData.id).update(newData);
                setTimeout(() => {
                  resolve();
                  this.getAllRetailers();
                }, 1000);
              }),
          }}
        />
      </div>
    );
  }

  getAllRetailers() {
    let retailersData = [];
    firestore.collection("superusers").onSnapshot((snap) => {
      snap.forEach((doc) => {
        let retailer = doc.data();
        if (retailer.role === "RETAILER") {
          retailer.city = this.state.cities.indexOf(retailer.city);
          retailer.active = retailer.active ? 0 : 1;
          retailersData.push(retailer);
        }
      });
      this.setState({
        bookings: retailersData,
      });
    });
  }

  getCities() {
    // console.log(this.props.user.cityId);
    let cities = [];
    let cityData = [];
    var query = firestore.collection("cities");
    query.get().then((snap) => {
      snap.forEach((doc) => {
        let city = doc.data();
        cities.push(city.city);
        cityData.push(city);
      });
      console.log(cities);
      this.setState({
        cities: cities,
        cityData: cityData,
      });
    });
  }
}

export default RetailersFragment;
