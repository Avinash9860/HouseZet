import MaterialTable from "material-table";
import React, { Component } from "react";
import { tableIcons } from "./UsersFragment";
import { connect } from "react-redux";
import { firestore } from "../firebase";
import Refresh from "@material-ui/icons/Refresh";

export class OffersFragment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceCat: [],
      serviceObj: [],
      offers: [],
    };
  }

  componentDidMount() {
    this.getServiceCategories();
    this.getOffers();
  }

  render() {
    return (
      <div>
        <MaterialTable
          icons={tableIcons}
          title="Offers"
          columns={[
            { title: "Title", field: "title" },
            {
              title: "Code",
              field: "code",
            },
            {
              title: "Type",
              field: "type",
              lookup: ["Retail", "Referal"]
            },
            {
              title: "%Off",
              field: "percent",
              type: "numeric",
            },
            {
              title: "Max Discount",
              field: "maxDiscount",
              type: "numeric",
            },
            {
              title: "Category",
              field: "category",
              lookup: this.state.serviceCat,
            },
            {
              title: "Availed",
              field: "availed",
              editable: false,
              render: (data) =>
                data.availed == undefined ? 0 : data.availed.length,
            },
            { title: "Status", field: "active", lookup: ["Enable", "Disable"] },
          ]}
          data={this.state.offers}
          options={{
            headerStyle: {
              position: "sticky",
              top: 0,
              fontSize: 18,
              backgroundColor: '#EEE',
            },
            exportButton: true
          }}
          actions={[
            {
              icon: Refresh,
              tooltip: 'Refresh Data',
              isFreeAction: true,
              onClick: () => this.getOffers(),
            }
          ]}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                newData.id = firestore.collection("offers").doc().id;
                newData.cityId = this.props.user.cityId;
                newData.retailerId = this.props.user.id;
                newData.active = false;
                var catIndex = parseInt(newData.category);
                newData.category =
                  newData.category == "All"
                    ? newData.category
                    : this.state.serviceCat[catIndex];
                newData.categoryId =
                  newData.category == "All"
                    ? newData.category
                    : this.state.serviceObj[catIndex].id;
                firestore.collection("offers").doc(newData.id).set(newData);
                setTimeout(() => {
                  resolve();
                  this.getOffers();
                }, 1000);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                firestore.collection("offers").doc(oldData.id).delete();
                setTimeout(() => {
                  resolve();
                  this.getOffers();
                }, 1000);
              }),

            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                console.log(newData);
                var catIndex = parseInt(newData.category);
                newData.category =
                  newData.category == "All"
                    ? newData.category
                    : this.state.serviceCat[catIndex];
                newData.categoryId =
                  newData.category == "All"
                    ? newData.category
                    : this.state.serviceObj[catIndex].id;
                newData.active = newData.active == "0" ? true : false;
                newData.retailerId = this.props.user.id;
                firestore.collection("offers").doc(newData.id).set(newData);
                setTimeout(() => {
                  resolve();
                  this.getOffers();
                }, 1000);
              }),
          }}
        />
      </div>
    );
  }
  getOffers() {
    let offers = [];
    var query = firestore
      .collection("offers")
      .where("retailerId", "==", this.props.user.id);
    query.get().then((snap) => {
      snap.forEach((doc) => {
        let offersData = doc.data();
        offersData.category = this.state.serviceCat.indexOf(
          offersData.category
        );
        offersData.active = offersData.active ? "0" : "1";
        offers.push(offersData);
      });
      this.setState({
        offers: offers,
      });
    });
  }
  getServiceCategories() {
    console.log(this.props.user.cityId);
    let serviceCategories = [];
    let objs = [];
    serviceCategories.push("All");
    objs.push({});
    var query = firestore
      .collection("categories")
      .where("cityId", "==", this.props.user.cityId);
    query.get().then((snap) => {
      snap.forEach((doc) => {
        let serviceCategory = doc.data();
        serviceCategories.push(serviceCategory.name);
        objs.push(serviceCategory);
      });
      this.setState({
        serviceCat: serviceCategories,
        serviceObj: objs,
      });
    });
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(OffersFragment);
