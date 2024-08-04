import React from "react";
import Profile from "../features/mypage/components/Profile";
import Level from "../features/mypage/components/Level";
import Calendar from "../features/mypage/components/Calendar";
import { Box } from "@mui/material";
const MyPage = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 5 }}>
      <Profile />
      <Level />
      <Calendar />
    </Box>
  );
};

export default MyPage;
