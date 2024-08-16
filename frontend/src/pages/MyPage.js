// MyPage.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "../features/auth/actions";
import { fetchCalendarWeek } from "../features/mypage/actions";
import Profile from "../features/mypage/components/Profile";
import Level from "../features/mypage/components/Level";
import Calendar from "../features/mypage/components/Calendar";
import FleaOn from "../features/mypage/components/FleaOn";
import { Box } from "@mui/material";

const MyPage = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // 페이지가 로드될 때 사용자 정보 가져오기
    dispatch(fetchUserInfo());
  }, [dispatch]);

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
