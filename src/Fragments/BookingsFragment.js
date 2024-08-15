import MaterialTable from "material-table";
import React, { Component } from "react";
import { tableIcons } from "./UsersFragment";
import { firestore } from "../firebase";
// var data = require("../bookings.json");
import Refresh from "@material-ui/icons/Refresh";
import { connect } from "react-redux";


export class BookingsFragment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
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
          title="Bookings"
          columns={[
            { title: "Booking ID", field: "bookingId" },
            { title: "Customer Name", field: "customerName" },
            { title: "Service Name", field: "serviceName" },
            { title: "Quantity", field: "serviceQuantity" },
            { title: "Order Total", field: "serviceTotalCost" },
            { title: "Discount", field: "serviceTotalDiscount" },
            { title: "Transaction Id", field: "transactionId" },
            { title: "Booking Status", field: "status" },
            { title: "Servicemen", field: "servicemenId" },
            { title: "Amount Due", field: "amountDue" },
          ]}
          data={this.state.bookings}
          actions={[
            {
              icon: Refresh,
              tooltip: 'Refresh Data',
              isFreeAction: true,
              onClick: () => this.getAllBookings(),
            }
          ]}
          options={{
            headerStyle: {
              position: "sticky",
              top: 0,
              fontSize: 16,
              backgroundColor: '#EEE',
            },
            exportButton: true
          }}
        />
      </div>
    );
  }

  getAllBookings() {
    let bookingsData = [];
    firestore.collection("bookings").where("retailerId", "==", this.props.user.id).onSnapshot((snap) => {
      snap.forEach((doc) => {
        bookingsData.push(doc.data());
      });
      this.setState({
        bookings: bookingsData,
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
export default connect(mapStateToProps)(BookingsFragment);
