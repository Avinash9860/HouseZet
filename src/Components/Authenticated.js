import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { firebaseAuth } from "../firebase";

const Authenticated = (props) => {
  const [loggedIn, setloggedIn] = useState(null);
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      setloggedIn(user);
    } else {
      setloggedIn(null);
    }
  });
  if (props.nonAuthenticated) {
    if (!loggedIn) {
      return props.children;
    } else if (loggedIn) {
      return <Redirect to="/" />;
    }
  } else {
    /* if(loggedIn === null){
        return "Loading...."
    }else  */ if (
      loggedIn
    ) {
      return props.children;
    } else if (!loggedIn) {
      return <Redirect to="/login" />;
    }
  }
};

export default Authenticated;
