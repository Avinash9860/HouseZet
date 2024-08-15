import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import Refresh from "@material-ui/icons/Refresh";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import MaterialTable from "material-table";
import React, { Component, forwardRef } from "react";
import { firestore } from "../firebase";

export const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Refresh: forwardRef((props, ref) => <Refresh {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

export default class UsersFragment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    this.getAllBookings();
  }

  render() {
    return (
      <div>
        <MaterialTable
          icons={tableIcons}
          cellEditable={{
            onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
              if (columnDef.field == "active") {
                newValue = newValue == "0" ? true : false;
              }
              var usersUpdate = {};
              usersUpdate[columnDef.field] = newValue;
              firestore
                .collection("users")
                .doc(rowData.id)
                .update(usersUpdate);
              return new Promise((resolve, reject) => {
                this.getAllBookings();
                setTimeout(resolve, 1000);
              });
            }
          }}
          title="Users"
          columns={[
            { title: "Full Name", field: "fullname" },
            { title: "Contact No.", field: "number", editable: "never" },
            { title: "Email", field: "email" },
            { title: "Last used", field: "lastLogin", editable: "never" },
            { title: "Build", field: "buildNo", editable: "never" },
            { title: "Status", field: "active", lookup: ["Enable", "Disable"] },
            { title: "ID", field: "id", hidden: true, editable: "never" },
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
          actions={[
            {
              icon: Refresh,
              tooltip: 'Refresh Data',
              isFreeAction: true,
              onClick: () => this.getAllBookings(),
            }
          ]}
        />
      </div>
    );
  }

  getAllBookings() {
    let bookingsData = [];
    firestore.collection("users").onSnapshot((snap) => {
      snap.forEach((doc) => {
        let userdata = doc.data();
        var lastUsed = new Date(userdata.lastLogin.toDate()).toDateString();
        let user = {
          fullname: userdata.name,
          number: userdata.number,
          email: userdata.email,
          buildNo: userdata.buildNo == null ? 1 : userdata.buildNo,
          lastLogin: lastUsed,
          active: userdata.active ? "0" : "1",
          id: userdata.id
        };
        bookingsData.push(user);
      });
      this.setState({
        bookings: bookingsData,
      });
    });
  }
}
