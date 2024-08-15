import MaterialTable from "material-table";
import React, { Component } from "react";
import { tableIcons } from "./UsersFragment";
import { firestore, firebaseAuth } from "../firebase";
import Refresh from "@material-ui/icons/Refresh";

// var data = require('../users.json');

export class AdminsFragment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
    };
  }

  componentDidMount() {
    this.getAllRetailers();
  }

  render() {
    return (
      <div>
        <MaterialTable
          icons={tableIcons}
          title="Administrators"
          columns={[
            { title: "Full Name", field: "fullname" },
            { title: "Email", field: "email" },
            { title: "Contact No", field: "contactNo" },
            { title: "Role", field: "role", editable: false },
          ]}
          data={this.state.bookings}
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
              onClick: () => this.getAllRetailers(),
            }
          ]}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                firebaseAuth
                  .createUserWithEmailAndPassword(newData.email, "pass@123")
                  .then(function (user) {
                    newData.active = false;
                    newData.role = "ADMIN";
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
                  resolve();
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
        if (retailer.role === "ADMIN") {
          retailersData.push(retailer);
        }
      });
      this.setState({
        bookings: retailersData,
      });
    });
  }
}

export default AdminsFragment;
