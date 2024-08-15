import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {
  ChildFriendly,
  DirectionsRun,
  EventAvailable,
  HomeRounded,
  CategoryTwoTone,
  ViewList,
  Work,
  Power,
  HomeWork,
  SupervisedUserCircle,
  SupervisorAccount,
} from "@material-ui/icons";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuIcon from "@material-ui/icons/Menu";
import AccountBox from "@material-ui/icons/AccountBox";
import clsx from "clsx";
import React, { useState } from "react";
import { firebaseAuth, firestore } from "../firebase";
import BookingsFragment from "../Fragments/BookingsFragment";
import HomeFragment from "../Fragments/HomeFragment";
import OffersFragment from "../Fragments/OffersFragment";
import ServiceMensFragment from "../Fragments/ServiceMensFragment";
import Settings from "@material-ui/icons/Settings";
import RetailersFragment from "../Fragments/RetailersFragment";
import AdminsFragment from "../Fragments/AdminsFragment";
import CitiesFragment from "../Fragments/CitiesFragment";
import UsersFragment from "../Fragments/UsersFragment";
import ServiceFragment from "../Fragments/ServiceFragment";
import ServiceCategoryFragment from "../Fragments/ServiceCategoryFragment";
import logo from "../media/logo.png";
import { connect } from "react-redux";
import AppConfigFragment from "../Fragments/AppConfigFragment";
import { AddUser } from "../Components/Actions/actionTypes";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 25,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  rightToolbar: {
    marginLeft: "auto",
    marginRight: -12
  },
}));


export function MiniDrawer(props) {
  const { user } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    getUser();
  }, []);


  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const resetPassword = () => {
    setAnchorEl(null);
    firebaseAuth.sendPasswordResetEmail(firebaseAuth.currentUser.email).then(function () {
      alert('Reset instructions sent on your email..')
    }).catch(function (e) {
      console.log(e)
    });
  };

  const signOut = () => {
    setAnchorEl(null);
    firebaseAuth.signOut();

  };

  const getUser = () => {
    firestore
      .collection("superusers")
      .doc(firebaseAuth.currentUser.uid)
      .get()
      .then((docRef) => {
        console.log(docRef.data());
        props.addUser(docRef.data());
      });
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [fragment, setfragment] = useState("HOME");

  const loadFragment = () => {
    switch (fragment) {
      case "HOME":
        return <HomeFragment />;
      case "Bookings_Fragment":
        return <BookingsFragment />;
      case "ServiceMens_Fragment":
        return <ServiceMensFragment />;
      case "Retailers_Fragment":
        return <RetailersFragment />;
      case "Cities_Fragment":
        return <CitiesFragment />;
      case "Admins_Fragment":
        return <AdminsFragment />;
      case "Offers_Fragment":
        return <OffersFragment />;
      case "Service_Fragment":
        return <ServiceFragment />;
      case "Service_Category_Fragment":
        return <ServiceCategoryFragment />;
      case "Users_Fragment":
        return <UsersFragment />;
      case "AppConfig_Fragment":
        return <AppConfigFragment />;
      default:
        break;
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography display="inline" style={{ fontSize: 22 }}>HouseZet</Typography>

          <div className={classes.rightToolbar} >
            <IconButton color="inherit" onClick={handleClick}>
              <AccountBox />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={resetPassword}>Change Password</MenuItem>
              <MenuItem onClick={signOut}>Logout</MenuItem>
            </Menu>
          </div>

        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {/* Home Button */}
          <ListItem selected={fragment == "HOME"} button title={"Home"} onClick={(e) => setfragment("HOME")}>
            <ListItemIcon>
              <HomeRounded />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          {/* Users Button */}
          {user.role === "ADMIN" && (
            <ListItem
              button
              title="Users"
              selected={fragment == "Users_Fragment"}
              onClick={(e) => setfragment("Users_Fragment")}
            >
              <ListItemIcon>
                <SupervisorAccount />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
          )}

          {/* Users Button */}
          {user.role === "ADMIN" && (
            <ListItem
              button
              selected={fragment == "Service_Category_Fragment"}
              title="Service Category"
              onClick={(e) => setfragment("Service_Category_Fragment")}
            >
              <ListItemIcon>
                <CategoryTwoTone />
              </ListItemIcon>
              <ListItemText primary="Categories" />
            </ListItem>
          )}

          {/* Bookings Button */}

          {user.role === "RETAILER" && (
            <ListItem
              button
              title="Bookings"
              selected={fragment == "Bookings_Fragment"}
              onClick={(e) => setfragment("Bookings_Fragment")}
            >
              <ListItemIcon>
                <EventAvailable />
              </ListItemIcon>
              <ListItemText primary="Bookings" />
            </ListItem>
          )}

          {/* Servicemen Button */}
          {user.role === "RETAILER" && (
            <ListItem
              button
              title="Servicemen"
              selected={fragment == "ServiceMens_Fragment"}
              onClick={(e) => setfragment("ServiceMens_Fragment")}
            >
              <ListItemIcon>
                <Work />
              </ListItemIcon>
              <ListItemText primary="Servicemen" />
            </ListItem>
          )}

          {/* Retailers Button */}
          {user.role === "ADMIN" && (
            <ListItem
              button
              title="Retailers"
              selected={fragment == "Retailers_Fragment"}
              onClick={(e) => setfragment("Retailers_Fragment")}
            >
              <ListItemIcon>
                <DirectionsRun />
              </ListItemIcon>
              <ListItemText primary="Retailers" />
            </ListItem>
          )}

          {/* Retailers Button */}
          {user.role === "RETAILER" && (
            <ListItem
              button
              title="Service"
              selected={fragment == "Service_Fragment"}
              onClick={(e) => setfragment("Service_Fragment")}
            >
              <ListItemIcon>
                <ViewList />
              </ListItemIcon>
              <ListItemText primary="Service" />
            </ListItem>
          )}



          {/* Admins Button */}
          {user.role === "ADMIN" && (
            <ListItem
              button
              title="Admins"
              selected={fragment == "Admins_Fragment"}
              onClick={(e) => setfragment("Admins_Fragment")}
            >
              <ListItemIcon>
                <HomeWork />
              </ListItemIcon>
              <ListItemText primary="Admins" />
            </ListItem>
          )}

          {/* Offers Button */}
          {user.role == "RETAILER" && (
            <ListItem
              button
              title="Offers"
              selected={fragment == "Offers_Fragment"}
              onClick={(e) => setfragment("Offers_Fragment")}
            >
              <ListItemIcon>
                <ChildFriendly />
              </ListItemIcon>
              <ListItemText primary="Offers" />
            </ListItem>
          )}

          {/* Cities Button */}
          {user.role === "ADMIN" && (
            <ListItem
              button
              title="Cities"
              selected={fragment == "Cities_Fragment"}
              onClick={(e) => setfragment("Cities_Fragment")}
            >
              <ListItemIcon>
                <LocationCityIcon />
              </ListItemIcon>
              <ListItemText primary="Cities" />
            </ListItem>
          )}

          <Divider />

          {/* AppConfiguartion Button */}
          {user.role === "ADMIN" && (
            <ListItem
              button
              title="Settings"
              selected={fragment == "AppConfig_Fragment"}
              onClick={(e) => setfragment("AppConfig_Fragment")}
            >
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          )}
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {loadFragment()}
      </main>
    </div>
  );
}

// const mapStateToProps = (state) => ({
//   user: state.user,
// });

const mapStateToProps = (state) => {
  //   console.log("In Dashboard");
  // console.log(state.user);
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addUser: (user) => dispatch(AddUser(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MiniDrawer);
