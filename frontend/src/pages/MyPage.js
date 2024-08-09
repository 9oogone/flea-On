import React ,{useEffect}from "react";
import Profile from "../features/mypage/components/Profile";
import Level from "../features/mypage/components/Level";
import Calendar from "../features/mypage/components/Calendar";
import FleaOn from "../features/mypage/components/FleaOn";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { fetchUserInfo } from "../features/auth/actions";


const MyPage = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    console.log("들어왓니")
    dispatch(fetchUserInfo());
  }, [dispatch]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 5 }}>
      <Profile />
      <Level />
      <Calendar />
      <FleaOn />
    </Box>
  );
};

export default MyPage;
