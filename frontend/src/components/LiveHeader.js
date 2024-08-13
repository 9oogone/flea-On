import React from "react";
import { Box, Typography } from "@mui/material";

const LiveHeader = () => (
  <>
    <Box
      sx={{
        padding: "3px",
        position: "absolute",
        background: "#FF0B55",
        borderRadius: 16,
        zIndex: "1",
      }}
    >
      <Typography
        sx={{
          color: "white",
          fontSize: 8,
          lineHeight: "8px",
        }}
      >
        LIVE
      </Typography>
    </Box>
    {/* <Box
      sx={{
        padding: "3px",
        left: 15,
        position: "absolute",
        background: "rgba(0, 0, 0, 0.20)",
        borderRadius: "0px 100px 100px 0px / 100px 100px 100px 100px",
      }}
    >
      <Typography
        sx={{
          color: "white",
          width: "38px",
          fontSize: 6,
          fontWeight: 400,
          textAlign: "right",
          lineHeight: "8px",
        }}
      >
        3명 시청 중
      </Typography>
    </Box> */}
  </>
);

export default LiveHeader;
