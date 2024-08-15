import { Container } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import Chart from "react-apexcharts";
import { Card, CardContent } from "@material-ui/core";
import UsersCard from "./HomeCards/UsersCard";
import BookingsCard from "./HomeCards/BookingsCard";
import ServicesCard from "./HomeCards/ServicesCards";
import ServicemenCard from "./HomeCards/ServicemenCard";
import OffersCard from "./HomeCards/OffersCard";

import CityCard from "./HomeCards/CityCard";
import RetailersCard from "./HomeCards/RetailersCard";

export class HomeFragment extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.user.role);
    this.state = {
      page: "HOME",
    };
  }
  render() {
    return (
      <Card>
        <CardContent>
          <div>
            <h3>Welcome {this.props.user.fullname}...!!!</h3>
            {this.props.user.role == "RETAILER" && (<Container fixed overflow="none" style={{ display: "flex" }}>
              <BookingsCard />
              <ServicesCard />
              <ServicemenCard />
              <OffersCard />
            </Container>)}

            {this.props.user.role == "ADMIN" && (<Container fixed overflow="none" style={{ display: "flex" }}>
              <UsersCard />
              <CityCard />
              <RetailersCard />
            </Container>)}
          </div>
        </CardContent>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  // console.log(state.user);
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(HomeFragment);
