import React from "react";
import { Box, Typography } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useSelector, useDispatch } from "react-redux";
import { toggleScrap } from "../features/live/scrapSlice";

const UpcomingHeader = ({ id, liveDate }) => {
  const dispatch = useDispatch();
  const isScrap = useSelector(
    (state) => state.scrap.live.find((item) => item.id === id)?.is_scrap
  );

  const handleScrapToggle = () => {
    dispatch(toggleScrap({ id }));
  };
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
          {liveDate}
        </Typography>
      </Box>
      <Box
        sx={{
          textAlign: "end",
          color: "white",
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleScrapToggle();
        }}
      >
        {isScrap ? <BookmarkIcon /> : <BookmarkBorderIcon />}
      </Box>
    </Box>
  );
};

export default UpcomingHeader;
