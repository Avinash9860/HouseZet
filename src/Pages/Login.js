import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { firebaseAuth, firestore } from "../firebase";
import logo from "../media/logo.png";
import { connect } from "react-redux";
import { AddUser } from "../Components/Actions/actionTypes";

class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      show_progress: false,
    };
    this.handleChange = this.handleChange.bind();
    this.login = this.login.bind();
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  login = () => {
    let valid_data = true;
    this.setState.email_error = null;
    this.setState.password_error = null;

    if (this.state.email === "" && this.state.password === "") {
      this.setState.email_error = "Required!";
      this.setState.password_error = "Required!";
      valid_data = false;
    }

    if (valid_data) {
      this.setState.show_progress = true;
    }
    this.setState({
      update: true,
    });

    if (valid_data) {
      firebaseAuth
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((user) => {
          console.log(user.user.uid);
          firestore
            .collection("superusers")
            .doc(user.user.uid)
            .get()
            .then((docRef) => {
              console.log(docRef.data());
              this.props.addUser(docRef.data());
              <Redirect to="/" />;
            });
        })
        .catch((error) => {
          console.log(error.code);
          alert("Bad Credentials, Try again");
        });
    } else console.log("Empty credentials");
  };
  render() {
    return (
      <Container maxWidth="xs">
        <Box
          bgcolor="white"
          boxShadow="2"
          textAlign="center"
          p="24px"
          mt="50px"
        >
          <img src={logo} alt="HouseZet" height="120px" />

          <TextField
            label="Email"
            id="outlined-size-small email"
            variant="outlined"
            fullWidth
            name="email"
            onChange={this.handleChange}
            error={this.state.email_error != null}
            helperText={this.state.email_error}
            color="secondary"
            margin="normal"
            size="small"
          />
          <TextField
            label="Password"
            id="outlined-size-small"
            type="password"
            variant="outlined"
            fullWidth
            name="password"
            onChange={this.handleChange}
            error={this.state.password_error != null}
            helperText={this.state.password_error}
            color="secondary"
            margin="normal"
            size="small"
          />

          <br />
          {this.state.show_progress ? (
            <CircularProgress size="25px" thickness={5} color="primary" />
          ) : null}
          <br />

          <Button
            variant="contained"
            color="primary"
            onClick={this.login}
            fullWidth
            type="submit"
          >
            Login
          </Button>
        </Box>
      </Container>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     user: state.user,
//   };
// };

const mapDispatchToProps = (dispatch) => {
  return {
    addUser: (user) => dispatch(AddUser(user)),
  };
};

export default connect(null, mapDispatchToProps)(login);
