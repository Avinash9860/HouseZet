import { Box, Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import BookingsFragment from "../Fragments/BookingsFragment";

const CardView = (props) => {
  return (
    <Box
      p="10px"
      boxShadow="8px"
      mx="4px"
      sm="column"
      borderRadius="10px"
      width="100%"
    >
      <Card>
        <CardContent>
          <Typography
            variant="h6"
            component="h2"
            style={{ color: "skyblue", cursor: "pointer" }}
          >
            {props.title}
          </Typography>{" "}
          <br />
          <Typography
            variant="h7"
            component="h2"
            style={{ textAlign: "center", cursor: "pointer" }}
          >
            {props.quantity}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CardView;
