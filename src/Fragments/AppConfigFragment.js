import React, { Component } from "react";
import {
  Button,
  Card,
  CardContent,
  Input,
  Box,
  Typography,
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import MaterialTable from "material-table";
import { tableIcons } from "./UsersFragment";
import Collapsible from 'react-collapsible';
import ExpandMore from "@material-ui/icons/ExpandMore";
import MenuItem from "@material-ui/core/MenuItem";
import "./css/collapsible_style.css"
import { firestore, storage } from "../firebase";

export class AppConfigFragment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      etro_checkbox_btn: true,
      etro_input_txt: "0",
      etro_switch_btn: false,
      partner_checkbox_btn: true,
      partner_input_txt: "0",
      partner_switch_btn: false,
      cites: [],
      selectedType: "Users",
      selectedTopic: "houseZet_users",
      notificationTitle: "",
      notificationText: "",
      includeImage: false,
      notificationImage: "",
      tempImage: "",
      currentCity: "",
      typeNames: ["City", "Users", "Partners", "Topic", "Dev"]
    };
    this.imageAsFile = null;
  }

  handleCityChange = (e) => {
    this.setState({
      currentCity: e.target.value,
      selectedTopic: "houseZet_" + e.target.value
    });
  };

  handleTypeChange = (e) => {
    this.setState({
      selectedType: e.target.value,
    });
    if (e.target.value == "City") {
      this.getCities();
    } else if (e.target.value == "Users") {
      this.setState({
        selectedTopic: "houseZet_users",
      });
    } else if (e.target.value == "Partners") {
      this.setState({
        selectedTopic: "houseZet_partners",
      });
    } else if (e.target.value == "Dev") {
      this.setState({
        selectedTopic: "houseZet_dev",
      });
    }
  };

  setPartnerInfo = () => {
    firestore.collection("remote_configs").doc("housezet_partner").update({
      forceUpdate: this.state.partner_checkbox_btn,
      version: parseInt(this.state.partner_input_txt),
      underMaintainance: this.state.partner_switch_btn,
    });
  };

  setEtroInfo = () => {
    firestore.collection("remote_configs").doc("houszet").update({
      forceUpdate: this.state.etro_checkbox_btn,
      version: parseInt(this.state.etro_input_txt),
      underMaintainance: this.state.etro_switch_btn,
    });
  };

  componentDidMount() {
    this.getConfigs();
    this.getSliderImages();
  }

  // ETRO-PARTNER undermaintainance
  partnerSwitch_handleChange = (event, value) => {
    this.setState({ partner_switch_btn: value });
  };
  // ETRO-PARTNER version
  partnerInput_txt_handleChange = (event, value) => {
    this.setState({ partner_input_txt: event.target.value });
  };
  // ETRO-PARTNER forceUpdate
  partnerCheckbox_handleChange = (event, value) => {
    this.setState({ partner_checkbox_btn: value });
  };

  // ETRO undermaintainance
  etroSwitch_handleChange = (event, value) => {
    this.setState({ etro_switch_btn: value });
  };
  // ETRO version
  etroInput_txt_handleChange = (event, value) => {
    this.setState({ etro_input_txt: event.target.value });
  };
  // ETRO forceUpdate
  etroCheckbox_handleChange = (event, value) => {
    this.setState({ etro_checkbox_btn: value });
  };

  render() {

    const collapsibleStyle = {
      height: 50,
      backgroundColor: "#bbbdbf",
      fontSize: 20,
      paddingLeft: 20,
      paddingRight: 20
    };

    return (
      <div>
        <Collapsible trigger={["Configurations", <ExpandMore />]} triggerStyle={collapsibleStyle}>
          <Card>
            <CardContent>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>HouseZet</h3>
                <div>
                  <Switch
                    checked={this.state.etro_switch_btn}
                    onChange={this.etroSwitch_handleChange}
                    name="UnderMaintainance"
                  />
                </div>
              </div>
              <div>
                <label for="version" style={{ fontSize: 18 }}>
                  App Version :{" "}
                </label>
                <Input
                  id="version"
                  type="number"
                  value={this.state.etro_input_txt}
                  inputProps={{ "aria-label": "description" }}
                  onChange={this.etroInput_txt_handleChange}
                />
                <Typography>
                  <Checkbox
                    color="primary"
                    checked={this.state.etro_checkbox_btn}
                    onChange={this.etroCheckbox_handleChange}
                    name="ForceUpdate"
                  />
                  Force Users to Update
                </Typography>

                <br />
                <Button
                  onClick={this.setEtroInfo}
                  variant="contained"
                  size="medium"
                  color="primary"
                >
                  Update
                </Button>
              </div>

              <br />

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>HouseZet Partner</h3>
                <div>
                  <Switch
                    checked={this.state.partner_switch_btn}
                    onChange={this.partnerSwitch_handleChange}
                    name="UnderMaintainance"
                  />
                </div>
              </div>
              <div>
                <label for="version" style={{ fontSize: 18 }}>
                  App Version :{" "}
                </label>
                <Input
                  id="version"
                  type="number"
                  value={this.state.partner_input_txt}
                  inputProps={{ "aria-label": "description" }}
                  onChange={this.partnerInput_txt_handleChange}
                />
                <Typography>
                  <Checkbox
                    color="primary"
                    checked={this.state.partner_checkbox_btn}
                    onChange={this.partnerCheckbox_handleChange}
                    name="ForceUpdate"
                  />
                  Force Users to Update
                </Typography>

                <br />
                <Button
                  onClick={this.setPartnerInfo}
                  variant="contained"
                  size="medium"
                  color="primary"
                >
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>
        </Collapsible>
        <br />

        <Collapsible trigger={["Slider's Images", <ExpandMore />]} triggerStyle={collapsibleStyle}>
          <MaterialTable
            icons={tableIcons}
            columns={[
              { title: "Title", field: "title" },
              { title: "Action", field: "action" },
              {
                title: "Image URL",
                field: "imgUrl",
                render: (rowData) => (
                  <img src={rowData.imgUrl} style={{ width: 150, height: 100 }} />
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
                          .ref(`slider/images/${imageAsFile.name}`)
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
                              .ref("slider/images")
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
              { title: "Active", field: "active" },
            ]}
            data={this.state.sliderImages}
            options={{
              headerStyle: {
                position: "sticky",
                top: 0,
                fontSize: 18,
              },
            }}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve, reject) => {
                  newData.id = firestore
                    .collection("remote_configs")
                    .doc("houszet")
                    .collection("sliders")
                    .doc().id;
                  firestore
                    .collection("remote_configs")
                    .doc("houszet")
                    .collection("sliders")
                    .doc(newData.id)
                    .set(newData);
                  setTimeout(() => {
                    resolve();
                    this.getSliderImages();
                  }, 1000);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  firestore
                    .collection("remote_configs")
                    .doc("houszet")
                    .collection("sliders")
                    .doc(oldData.id)
                    .set(newData);
                  setTimeout(() => {
                    this.getSliderImages();
                    resolve();
                  }, 1000);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  console.log(oldData);
                  firestore
                    .collection("remote_configs")
                    .doc("houszet")
                    .collection("sliders")
                    .doc(oldData.id)
                    .delete();
                  setTimeout(() => {
                    this.getSliderImages();
                    resolve();
                  }, 1000);
                }),
            }}
          />
        </Collapsible>
        <br />
        <Collapsible trigger={["Notifications", <ExpandMore />]} triggerStyle={collapsibleStyle}>
          <Card>
            <CardContent>

              <label>To :</label>
              <Box>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={this.state.selectedType}
                  onChange={this.handleTypeChange}
                >
                  {this.state.typeNames.map((city) => {
                    return <MenuItem value={city}>{city}</MenuItem>;
                  })}
                </Select>
              </Box>

              <br />
              {this.state.selectedType == "City" ? <Box>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={this.state.currentCity}
                  onChange={this.handleCityChange}
                >
                  {this.state.cites.map((city) => {
                    return <MenuItem value={city.id}>{city.city}</MenuItem>;
                  })}
                </Select>
              </Box> : <></>}
              {this.state.selectedType == "Topic" ? <input value={this.state.selectedTopic} onChange={(e) => {
                this.setState({
                  selectedTopic: e.target.value
                });
              }} /> : <></>}

              <br />
              <br />
              <input checked={this.state.includeImage} type="checkbox" onChange={(e) => {
                this.setState({
                  includeImage: e.target.checked
                });
              }} />
              <label for="a">Include image</label>
              {
                this.state.selectedTopic != "" && this.state.includeImage ? <div><br /> <input
                  type="file"
                  onChange={(e) => {
                    console.log(e.target.files[0]);
                    this.imageAsFile = e.target.files[0];
                    this.setState({
                      tempImage: this.imageAsFile == undefined ? "" : URL.createObjectURL(this.imageAsFile)
                    });
                  }}
                />{this.state.tempImage != "" ? <img alt="Preview" src={this.state.tempImage} height="120px" width="180px" /> : <></>}</div> : <></>
              }


              {
                this.state.selectedTopic != "" && !this.state.includeImage ? <div><br /> <input value={this.state.notificationTitle} placeholder="Title" onChange={(e) => {
                  this.setState({
                    notificationTitle: e.target.value
                  });
                }} /></div> : <></>
              }

              {
                this.state.selectedTopic != "" && !this.state.includeImage ? <div><br /> <textarea placeholder="Notification body goes here..." value={this.state.notificationText} rows="4" cols="50" onChange={(e) => {
                  this.setState({
                    notificationText: e.target.value
                  });
                }}></textarea></div> : <></>
              }
              {this.state.selectedTopic != "" ? <div><br /><Button disabled={this.state.includeImage ? this.state.tempImage == "" : (this.state.notificationTitle == "" || this.state.notificationText == "")} onClick={() => {
                this.sendNotification();
              }} style={{ backgroundColor: "grey" }}>Send</Button></div> : <></>}
            </CardContent>
          </Card>
        </Collapsible>
      </div>
    );
  }

  sendNotification() {
    if (this.state.includeImage) {
      const uploadTask = storage
        .ref(`notification/images/${this.imageAsFile.name}`)
        .put(this.imageAsFile);
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
            .ref("notification/images")
            .child(this.imageAsFile.name)
            .getDownloadURL()
            .then((url) => {
              const token = "AAAAJ0Qbi5c:APA91bF-DuYVaRYMWmZK-g86B0O2KFpy8irj0GVtG7yyaasNJB2kaGUEHX_T0a6pluBKx78xQ2GrcCKbRoNMa3OQo064Ds2C6CLORGDZx6iiASn6ELlv_LNMq7WPaX5Z3qMuLWgh8zLi";
              const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'key=' + token
              }
              const postObject = {
                'to': "/topics/" + this.state.selectedTopic,
                'notification': { 'body': this.state.notificationText, 'title': this.state.notificationTitle, "image": url },
              }
              const requestOptions = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(postObject)
              };
              fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
                .then((res) => {
                  this.setState({
                    selectedType: "Users",
                    selectedTopic: "houseZet_users",
                    notificationTitle: "",
                    notificationText: "",
                    includeImage: false,
                    notificationImage: "",
                  });
                }).then(() => {
                  alert("Notification Sent successfully");
                });
            });
        }
      );
    } else {
      const token = "AAAAJ0Qbi5c:APA91bF-DuYVaRYMWmZK-g86B0O2KFpy8irj0GVtG7yyaasNJB2kaGUEHX_T0a6pluBKx78xQ2GrcCKbRoNMa3OQo064Ds2C6CLORGDZx6iiASn6ELlv_LNMq7WPaX5Z3qMuLWgh8zLi";
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'key=' + token
      }
      const postObject = {
        'to': "/topics/" + this.state.selectedTopic,
        'notification': { 'body': this.state.notificationText, 'title': this.state.notificationTitle, },
      }
      const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(postObject)
      };
      fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
        .then((res) => {
          this.setState({
            selectedType: "Users",
            selectedTopic: "houseZet_users",
            notificationTitle: "",
            notificationText: "",
            includeImage: false,
            notificationImage: "",
          });
        }).then(() => {
          alert("Notification Sent successfully");
        });
    }
  }


  getConfigs() {
    firestore
      .collection("remote_configs")
      .doc("housezet_partner")
      .get()
      .then((docRef) => {
        this.setState({
          partner_input_txt: docRef.data()["version"],
          partner_checkbox_btn: docRef.data()["forceUpdate"],
          partner_switch_btn: docRef.data()["underMaintainance"],
        });
      });

    firestore
      .collection("remote_configs")
      .doc("houszet")
      .get()
      .then((docRef) => {
        this.setState({
          etro_input_txt: docRef.data()["version"],
          etro_checkbox_btn: docRef.data()["forceUpdate"],
          etro_switch_btn: docRef.data()["underMaintainance"],
        });
        console.log(docRef.data());
      });
  }

  getSliderImages() {
    let imageList = [];
    firestore
      .collection("remote_configs")
      .doc("houszet")
      .collection("sliders")
      .onSnapshot((snap) => {
        snap.forEach((doc) => {
          let imageData = doc.data();
          imageList.push(imageData);
        });
        console.log(imageList);
        this.setState({
          sliderImages: imageList,
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

export default AppConfigFragment;
