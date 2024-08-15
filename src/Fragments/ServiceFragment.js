import React, { Component } from "react";
import { firestore, storage } from "../firebase";
import { Card, CardContent, TextField } from "@material-ui/core";
import MaterialTable from "material-table";
import { tableIcons } from "./UsersFragment";
import Refresh from "@material-ui/icons/Refresh";
import { connect } from "react-redux";
import Switch from "@material-ui/core/Switch";

export class ServiceFragment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cites: [],
      serviceCat: [],
      serviceObj: [],
      services: [],
      currentCity: "",
    };
  }

  componentDidMount() {
    // this.getCities();
    this.getServiceCategories();
    this.getServices();
  }

  render() {
    return (
      <CardContent>
        <MaterialTable
          icons={tableIcons}
          title="Services"
          columns={[
            {
              title: "Tranding",
              field: "isTranding",
              lookup: ["Yes", "No"],
            },
            { title: "Name", field: "serviceName" },

            {
              title: "Description", field: "description",
              render: (rowData) => (
                <p style={{ overflow: "hidden", textOverflow: "clip", height: 100 }}>{rowData.description}</p>
              ),
              editComponent: (props) => (
                <textarea
                  rows={5}
                  type="text"
                  value={props.value}
                  onChange={(e) => props.onChange(e.target.value)}
                />
              )
            },

            {
              title: "Category",
              field: "serviceCategory",
              editable: "onAdd",
              lookup: this.state.serviceCat,
            },
            { title: "MRP", field: "mrp" },
            { title: "Final Price", field: "serviceCharge" },

            { title: "Conveyence Charge", field: "convCharge" },
            {
              title: "Image",
              field: "thumbnail",
              render: (rowData) => (
                <img
                  src={rowData.thumbnail}
                  style={{ width: 120, height: 80 }}
                />
              ),
              editComponent: (props) =>
                typeof props.value == typeof "string" && props.value != "" ? (
                  <input
                    type="text"
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                  />
                ) : (
                  <input
                    type="file"
                    onChange={(e) => {
                      console.log(e.target.files[0]);
                      var imageAsFile = e.target.files[0];
                      const uploadTask = storage
                        .ref(`service/images/${imageAsFile.name}`)
                        .put(imageAsFile);

                      uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                          // progress function ...
                        },
                        (error) => {
                          console.log(error);
                        },
                        () => {
                          // complete function ...
                          storage
                            .ref("service/images")
                            .child(imageAsFile.name)
                            .getDownloadURL()
                            .then((url) => {
                              props.onChange(url);
                            });
                        }
                      );
                    }}
                  />
                ),
            },
            { title: "Status", field: "active", lookup: ["Enable", "Disable"] },
          ]}
          data={this.state.services}
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
              onClick: () => this.getServiceCategories(),
            }
          ]}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                var catIndex = parseInt(newData.serviceCategory);
                newData.id = firestore.collection("categories").doc().id;
                newData.cityId = this.props.user.cityId;
                newData.retailerId = this.props.user.id;
                newData.active = newData.active == "0" ? true : false;
                newData.isTranding = newData.isTranding == "0" ? true : false;
                newData.serviceCategory = this.state.serviceCat[catIndex];
                newData.serviceCategoryId = this.state.serviceObj[catIndex].id;
                console.log(newData);
                firestore.collection("services").doc(newData.id).set(newData);
                setTimeout(() => {
                  resolve();
                  this.getServices();
                }, 1000);
              }),

            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                console.log(newData);
                var catIndex = parseInt(newData.serviceCategory);
                newData.cityId = this.props.user.cityId;
                newData.retailerId = this.props.user.id;
                newData.active = newData.active == "0" ? true : false;
                newData.isTranding = newData.isTranding == "0" ? true : false;
                newData.serviceCategory = this.state.serviceCat[catIndex];
                newData.serviceCategoryId = this.state.serviceObj[catIndex].id;
                firestore.collection("services").doc(oldData.id).update(newData);
                setTimeout(() => {
                  this.getServices();
                  resolve();
                }, 1000);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                firestore.collection("services").doc(oldData.id).delete();
                setTimeout(() => {
                  this.getServices();
                  resolve();
                }, 1000);
              }),
          }}
        />
      </CardContent>
    );
  }

  getServiceCategories() {
    console.log(this.props.user.cityId);
    let serviceCategories = [];
    let objs = [];
    var query = firestore
      .collection("categories")
      .where("cityId", "==", this.props.user.cityId);
    query.get().then((snap) => {
      snap.forEach((doc) => {
        let serviceCategory = doc.data();
        serviceCategories.push(serviceCategory.name);
        objs.push(serviceCategory);
      });
      console.log(serviceCategories);
      this.setState({
        serviceCat: serviceCategories,
        serviceObj: objs,
      });
    });
  }
  getServices() {
    // console.log(this.props.user.cityId);
    let services = [];
    var query = firestore
      .collection("services")
      .where("retailerId", "==", this.props.user.id);
    query.get().then((snap) => {
      snap.forEach((doc) => {
        let serviceCategory = doc.data();
        serviceCategory.serviceCategory = this.state.serviceCat.indexOf(
          serviceCategory.serviceCategory
        );
        serviceCategory.active = serviceCategory.active ? "0" : "1";
        serviceCategory.isTranding = serviceCategory.isTranding ? 0 : 1;
        services.push(serviceCategory);
      });
      this.setState({
        services: services,
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

export default connect(mapStateToProps)(ServiceFragment);
