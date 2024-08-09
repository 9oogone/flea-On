// MyPage.js
import React from "react";
import Profile from "../features/mypage/components/Profile";
import Level from "../features/mypage/components/Level";
import Calendar from "../features/mypage/components/Calendar";
import FleaOn from "../features/mypage/components/FleaOn";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";

const MyPage = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 5, p: 2 }}>
      <Profile user={user} />
      <Level level={user?.level} />
      <Calendar />
      <FleaOn />
    </Box>
  );
};

export default MyPage;
