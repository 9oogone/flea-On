import React from "react";
import { Box, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// 주소에서 '동' 부분만 추출하기
const extractDong = (address) => {
  const match = address.match(/(\S+동)/);
  return match ? match[1] : "";
};

const UpcomingFooter = ({ name, tradePlace, title, price }) => {
  const dongName = extractDong(tradePlace);

  return (
    <Box
      sx={{
        top: 206,
        left: "7.50px",
        width: "100%",
        textAlign: "left",
      }}
    >
      <Typography
        sx={{
          color: "white",
          fontSize: 8,
          fontWeight: 400,
        }}
      >
        <LocationOnIcon sx={{ fontSize: "8px" }} />
        {dongName}
      </Typography>

      <Typography
        sx={{
          color: "white",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default UpcomingFooter;
