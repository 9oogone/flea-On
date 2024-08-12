import React from "react";
import { Box, Typography } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { isBefore, isToday } from "date-fns";
import {
  formatPrice,
  extractDong,
  getRelativeDate,
} from "../../../utils/cssUtils";

const Buys = ({ items }) => {
  console.log("일", items);
  const { purchases } = items;
  const { tradeDoneResponses } = items;
  console.log("이", purchases);
  console.log("삼", tradeDoneResponses);
  // const getStatus = (item) => {
  //   const itemDateTime = new Date(`${date}T${time}`);
  //   const now = new Date();

  //   if (isBefore(itemDateTime, now)) {
  //     if (isToday(itemDateTime)) {
  //       return { text: "거래 중", color: "#FF5757" };
  //     } else {
  //       return { text: "거래완료", color: "#CCCCCC" };
  //     }
  //   } else {
  //     return { text: "거래예정", color: "#FF0B55" };
  //   }
  // };

  // console.log(items);
  return <Box>diq</Box>;
};

export default Buys;
