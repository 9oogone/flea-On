import React from "react";
import Profile from "../features/mypage/components/Profile";
import Level from "../features/mypage/components/Level";
import Calendar from "../features/mypage/components/Calendar";
const MyPage = () => {
  return (
    <div>
      <h1>마이페이지</h1>
      <Profile />
      <Level />
      <Calendar />
    </div>
  );
};

export default MyPage;
