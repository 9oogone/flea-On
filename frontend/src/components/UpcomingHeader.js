import React from "react";
import { Box, Typography } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const UpcomingHeader = ({ liveDate, isScrap }) => (
  <>
    <Box
      sx={{
        padding: "3px",
        position: "absolute",
        background: "white",
        borderRadius: 16,
      }}
    >
      <Typography
        sx={{
          color: "black",
          fontSize: 8,
          lineHeight: "8px",
        }}
      >
        {liveDate}
      </Typography>
    </Box>
    <Box
      sx={{
        textAlign: "end",
        color: "white",
      }}
    >
      {isScrap ? <BookmarkIcon /> : <BookmarkBorderIcon />}
    </Box>
  </>
);

export default UpcomingHeader;
