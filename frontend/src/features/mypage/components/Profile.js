<<<<<<< HEAD
import React, { useState } from "react";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../../styles/Profile.css";
=======
import React from "react";
>>>>>>> b1fcdcdbf75b61dd03a812f5b7f24f8dca87768b
import ProfileDefault from "../../../assets/images/profile_default.svg";
import { Container, Avatar, Box, Typography } from "@mui/material";

<<<<<<< HEAD
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
import CustomerDateTimeSelector from "../../../components/CustomerDateTimeSelector";

const dummyDatas = {
  place: "덕명동 삼성화재 유성연수원 경비실 앞",
  live_date: "2024-08-06",
  times: [
    {
      tradeStart: "10:00",
      tradeEnd: "17:00",
      date: "2024-08-06",
    },
    {
      tradeStart: "06:00",
      tradeEnd: "10:00",
      date: "2024-08-07",
    },
    {
      tradeStart: "14:00",
      tradeEnd: "16:00",
      date: "2024-08-07",
    },
    {
      tradeStart: "11:00",
      tradeEnd: "13:00",
      date: "2024-08-08",
    },
    {
      tradeStart: "10:00",
      tradeEnd: "11:00",
      date: "2024-08-10",
    },
    {
      tradeStart: "12:00",
      tradeEnd: "19:00",
      date: "2024-08-11",
    },
    {
      tradeStart: "01:00",
      tradeEnd: "20:00",
      date: "2024-08-12",
    },
  ],
};
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// 임시 사용자 정보
const mockUserInfo = {
  profileImage: ProfileDefault,
  nickname: "이것저것팝니다",
  email: "hong@example.com",
  phoneNumber: "010-1234-5902",
  address: "대전광역시 유성구 덕명동",
};

const Profile = () => {
  // 리덕스 스토어에서 사용자 정보를 가져옵니다.
  //   const userInfo = useSelector((state) => state.mypage.userInfo);
  const navigate = useNavigate();
  const userInfo = mockUserInfo; // 임시 사용자 정보 사용

  // 주소에서 '동' 부분만 추출하기
  const extractDong = (address) => {
    const match = address.match(/(\S+동)/);
    return match ? match[1] : "";
  };

  //////////////////////////////////////////////////////////////////////////
  /////////////////////////////거래장소시간 선택 모달
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState(dummyDatas.place);
  const [live_date, setLiveDate] = useState(dummyDatas.live_date);
  const [times, setTimes] = useState([]);

  const handleCustomerClick = () => {
    setPlace(dummyDatas.place);
    setLiveDate(dummyDatas.live_date);
    const timeSlots = generateTimeSlots(dummyDatas.times);
    setTimes(timeSlots);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const generateTimeSlots = (tradeTimes) => {
    const slots = [];

    tradeTimes.forEach((time) => {
      let start = new Date(`${time.date}T${time.tradeStart}`);
      const end = new Date(`${time.date}T${time.tradeEnd}`);

      while (start < end) {
        slots.push({
          time: start.toTimeString().slice(0, 5),
          date: time.date,
        });

        // 새로운 Date 객체를 생성하여 30분을 추가합니다.
        start = new Date(start.getTime() + 30 * 60000); // 30분 = 30 * 60000 밀리초
      }
    });
    return slots;
  };

  const handleProfileEdit = () => {
    navigate(`/profile-edit/${userInfo.email}`);
  };
  //////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

=======
const Profile = ({ user }) => {
>>>>>>> b1fcdcdbf75b61dd03a812f5b7f24f8dca87768b
  return (
    <Container
      sx={{
        mt: 7,
        mb: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Avatar
        src={user?.profilePicture || ProfileDefault}
        alt={`${user?.nickname || "사용자"}'s profile`}
        sx={{ width: 60, height: 60 }}
      />
<<<<<<< HEAD
      <h3>{userInfo.nickname}</h3>
      <p>{extractDong(userInfo.address)} 주민</p>
      <button onClick={handleProfileEdit}>프로필 편집</button>
      <CustomerDateTimeSelector
        open={open}
        handleClose={handleClose}
        place={place}
        live_date={live_date}
        times={times}
      />
    </div>
=======
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // 이 부분 유지
          mt: 0.5,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "600" }}>
          {user?.nickname || "닉네임"}
        </Typography>
        <Typography> 플리온 주민</Typography>
      </Box>
      <Box
        sx={{
          px: 1,
          py: 0.5,
          bgcolor: "#CCCCCC",
          color: "#FFFFFF",
          borderRadius: 5,
          fontSize: 12,
        }}
      >
        프로필 수정
      </Box>
    </Container>
>>>>>>> b1fcdcdbf75b61dd03a812f5b7f24f8dca87768b
  );
};

export default Profile;
