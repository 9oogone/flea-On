import React from "react";
import { Box, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const LiveFooter = ({ name, tradePlace, title, price }) => (
  <Box
    sx={{
      top: 206,
      left: "7.50px",
      width: "100%",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            color: "white",
            fontSize: 8,
            fontWeight: 400,
          }}
        >
          <LocationOnIcon sx={{ fontSize: "8px" }} />
          {tradePlace}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontSize: 10,
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: "white",
            fontSize: 10,
            fontWeight: 500,
          }}
        >
          {price}원
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default LiveFooter;
