import MaterialTable from "material-table";
import React, { Component } from "react";
import { tableIcons } from "./UsersFragment";
import { firestore } from "../firebase";
import { connect } from "react-redux";
import Refresh from "@material-ui/icons/Refresh";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';


export class ServiceMensFragment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servicemens: [],
      selectedValues: []
    };

  }


  componentDidMount() {
    this.getServiceMens();
  }

  render() {
    const options = [
      { label: 'Bakery', value: 'Bakery' },
      { label: 'Beauty', value: 'Beauty' },
      { label: 'Carpentry', value: 'Carpentry' },
      { label: 'Cleaning', value: 'Cleaning' },
      { label: 'Electrical', value: 'Electrical' },
      { label: 'Electronic and Appliances', value: 'Electronic and Appliances' },
      { label: 'Home Decor', value: 'Home Decor' },
      { label: 'Moving', value: 'Moving' },
      { label: 'Plumbing', value: 'Plumbing' },
      { label: 'Laundry', value: 'Laundry' },
      { label: 'Painting', value: 'Painting' },
      { label: 'Smart Home', value: 'Smart Home' },
      { label: 'Water Treatments', value: 'Water Treatments' },
      { label: 'Car Cleaning', value: 'Car Cleaning' },
      { label: 'Pest Control', value: 'Pest Control' },
    ];
    return (
      <div>
        <MaterialTable
          icons={tableIcons}
          title="Service Mens"
          columns={[
            { title: "Full Name", field: "fullName" },
            { title: "Contact No.", field: "contactNo" },
            {
              title: "Skills", field: "skills", editComponent: () => {
                return <ReactMultiSelectCheckboxes options={options} value={this.state.selectedValues} onChange={(value, event) => {
                  this.setState({ selectedValues: value });
                }} />
              },
              render: (rowData) => (
                <p>{rowData.skills}</p>
              ),
            },
            { title: "Build", field: "buildNo", editable: "never" },
            { title: "Status", field: "active", lookup: ["Enable", "Disable"] },
          ]}
          data={this.state.servicemens}
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
              onClick: () => this.getServiceMens(),
            }
          ]}
          editable={
            this.props.user != null
              ? {
                onRowAdd: (newData) =>
                  new Promise((resolve, reject) => {
                    newData.id = firestore.collection("servicemens").doc().id;
                    newData.active = true;
                    newData.cityId = this.props.user.cityId;
                    newData.retailerId = this.props.user.id;
                    let selected = [];
                    this.state.selectedValues.forEach((val) => {
                      selected.push(val.value);
                    });
                    newData.skills = selected;
                    this.setState({ selectedValues: [] });
                    firestore
                      .collection("servicemens")
                      .doc(newData.id)
                      .set(newData);
                    setTimeout(() => {
                      resolve();
                    }, 1000);
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    let selected = [];
                    this.state.selectedValues.forEach((val) => {
                      selected.push(val.value);
                    });
                    newData.skills = selected;
                    newData.active = newData.active == "0" ? true : false;
                    this.setState({ selectedValues: [] });
                    firestore
                      .collection("servicemens")
                      .doc(oldData.id)
                      .update(newData);
                    setTimeout(() => {
                      this.getServiceMens();
                      resolve();
                    }, 1000);
                  }),
              }
              : {}
          }
        />
      </div>
    );
  }

  getServiceMens() {
    let servicemenData = [];
    firestore.collection("servicemens").where("retailerId", "==", this.props.user.id).onSnapshot((snap) => {
      snap.forEach((doc) => {
        let servicemen = doc.data();
        servicemen.active = servicemen.active ? "0" : "1";
        servicemen.buildNo = servicemen.buildNo == null ? 1 : servicemen.buildNo;
        servicemenData.push(servicemen);
      });
      this.setState({
        servicemens: servicemenData,
      });
    });
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(ServiceMensFragment);

// cityId: this.props.user.cityId,
// retailerId: this.props.user.id,
