import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { format, parseISO, isToday, isTomorrow } from "date-fns";

const UpcomingHeader = ({ liveDate, scrap, setScrap }) => {
  let date;
  let formattedDate;
  let formattedTime;

  try {
    date = parseISO(liveDate);
    if (isNaN(date)) throw new Error("Invalid date");

    if (isToday(date)) {
      formattedDate = "오늘";
    } else if (isTomorrow(date)) {
      formattedDate = "내일";
    } else {
      formattedDate = format(date, "MM/dd");
    }

    formattedTime = format(date, "a hh시 mm분");
  } catch (error) {
    console.error("Invalid date format:", liveDate);
    formattedDate = "Invalid date";
    formattedTime = "";
  }

  return (
    <Box>
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
          {`${formattedDate}, ${formattedTime}`}
        </Typography>
      </Box>
      <IconButton
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          color: "white",
          width: "100%",
          p: 0,
        }}
        onClick={(e) => {
          e.stopPropagation();
          setScrap();
        }}
      >
        {scrap ? <BookmarkIcon /> : <BookmarkBorderIcon />}
      </IconButton>
    </Box>
  );
};

export default UpcomingHeader;
