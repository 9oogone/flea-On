import React from "react";
import { Box, Typography } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { format, parseISO, isToday, isTomorrow } from "date-fns";
// import { toggleScrap } from "../features/live/scrapSlice";

const UpcomingHeader = ({ liveDate, isScrap }) => {
  // liveDate를 Date 객체로 변환
  const date = parseISO(liveDate);
  // 현재 날짜와 비교하여 형식 결정
  let formattedDate;
  if (isToday(date)) {
    formattedDate = "오늘";
  } else if (isTomorrow(date)) {
    formattedDate = "내일";
  } else {
    formattedDate = format(date, "MM/dd"); // 예: 11/30
  }

  // 시간 포맷 설정 (오전/오후 00시 00분)
  const formattedTime = format(date, "a hh시 mm분");

  // const handleScrapToggle = () => {
  //   dispatch(toggleScrap({ id }));
  // };
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
