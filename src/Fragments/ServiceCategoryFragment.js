import React, { Component } from "react";
import { firestore } from "../firebase";
import { Box, Card, CardContent } from "@material-ui/core";
import MaterialTable from "material-table";
import { tableIcons } from "./UsersFragment";
import Refresh from "@material-ui/icons/Refresh";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from "react-redux";

export class ServiceCategoryFragment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cites: [],
      serviceCat: [],
      currentCity: " ",
      cat: [
        "Bakery",
        "Beauty",
        "Carpentry",
        "Cleaning",
        "Electrical",
        "Electronic and Appliances",
        "Home Decor",
        "Laundry",
        "Moving",
        "Plumbing",
        "Painting",
        "Smart Home",
        "Water Treatments",
        "Car Cleaning",
        "Pest Control",
      ],
    };
  }

  componentDidMount() {
    this.getCities();
    // this.getServiceCategories();
  }

  handleCityChange = (e) => {
    this.setState({
      currentCity: e.target.value,
    });
    console.log(e.target.value);
    this.getServiceCategories(e.target.value);
  };
  render() {
    return (
      <Box>
        <MaterialTable
          icons={tableIcons}
          cellEditable={{
            onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
              if (columnDef.field == "active") {
                newValue = newValue == "0" ? true : false;
              } else if (columnDef.field == "name") {
                newValue = this.state.cat[parseInt(newValue)];
              }
              var usersUpdate = {};
              usersUpdate[columnDef.field] = newValue;
              firestore
                .collection("categories")
                .doc(rowData.id)
                .update(usersUpdate);
              return new Promise((resolve, reject) => {
                this.getServiceCategories(this.state.currentCity);
                setTimeout(resolve, 1000);
              });
            }
          }}
          title={
            <Box>
              <p style={{ fontSize: 20 }}>Service categories</p>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={this.state.currentCity}
                onChange={this.handleCityChange}
              >
                <MenuItem value=" ">Select City</MenuItem>
                {this.state.cites.map((city) => {
                  return <MenuItem value={city.id}>{city.city}</MenuItem>;
                })}
              </Select>
            </Box>
          }
          columns={[
            {
              title: "Category Name",
              field: "name",
              lookup: this.state.cat,
              editable: "onAdd",
            },
            { title: "Category Id", field: "id", editable: false, editable: "never" },
            { title: "Active", field: "active", lookup: ["Enabled", "Disabled"] },
          ]}
          data={this.state.serviceCat}
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
          editable={
            this.state.currentCity != " "
              ? {
                onRowAdd: (newData) =>
                  new Promise((resolve, reject) => {
                    console.log(this.state.serviceCat);
                    console.log(this.state.cat[parseInt(newData.name)]);
                    newData.id = firestore.collection("categories").doc().id;
                    newData.cityId = this.state.currentCity;
                    newData.name = this.state.cat[parseInt(newData.name)];
                    newData.active = true;
                    firestore
                      .collection("categories")
                      .doc(newData.id)
                      .set(newData);
                    setTimeout(() => {
                      resolve();
                      this.getServiceCategories(this.state.currentCity);
                    }, 1000);
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve, reject) => {
                    firestore
                      .collection("categories")
                      .doc(oldData.id)
                      .delete();
                    setTimeout(() => {
                      resolve();
                      this.getServiceCategories(this.state.currentCity);
                    }, 1000);
                  }),
              }
              : {}
          }
        />
      </Box>
    );
  }

  getServiceCategories(city) {
    let serviceCategories = [];
    var query = firestore.collection("categories").where("cityId", "==", city);
    query.get().then((snap) => {
      snap.forEach((doc) => {
        let serviceCategory = doc.data();
        serviceCategory.active = serviceCategory.active ? "0" : "1";
        serviceCategory.name = this.state.cat.indexOf(serviceCategory.name);
        serviceCategories.push(serviceCategory);
      });
      this.setState({
        serviceCat: serviceCategories,
      });
    });
  }
  getCities() {
    let citiesList = [];
    firestore.collection("cities").onSnapshot((snap) => {
      snap.forEach((doc) => {
        let cityData = doc.data();
        citiesList.push(cityData);
      });
      console.log(citiesList);
      this.setState({
        cites: citiesList,
      });
    });
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(ServiceCategoryFragment);
