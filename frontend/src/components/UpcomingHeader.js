import React from "react";
import { Box, Typography } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { format, parseISO, isToday, isTomorrow } from "date-fns";
import { formatTime } from "../utils/cssUtils";

const UpcomingHeader = ({ liveDate, isScrap }) => {
  let date;
  let formattedDate;
  let formattedTime;

  // liveDate가 유효한지 확인하고 변환
  try {
    console.log(liveDate);
    date = parseISO(liveDate);
    if (isNaN(date)) throw new Error("Invalid date");

    // 현재 날짜와 비교하여 형식 결정
    if (isToday(date)) {
      formattedDate = "오늘";
    } else if (isTomorrow(date)) {
      formattedDate = "내일";
    } else {
      formattedDate = format(date, "MM/dd"); // 예: 11/30
    }

    // 시간 포맷 설정 (오전/오후 00시 00분)
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
          {`${formattedDate}, ${formattedTime}`.trim()}
        </Typography>
      </Box>
      <Box
        sx={{
          textAlign: "end",
          color: "white",
        }}
        // onClick={(e) => {
        //   e.stopPropagation();
        //   handleScrapToggle();
        // }}
      >
        {isScrap ? <BookmarkIcon /> : <BookmarkBorderIcon />}
      </Box>
    </Box>
  );
};

export default UpcomingHeader;
