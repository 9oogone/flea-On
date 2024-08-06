import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Switch from "../../../components/Switch";
import Lives from "./SellLives.js";
import Shorts from "./SellShorts.js";
import { Container, Box, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { switchTab } from "../selllistSlice.js";

const SellList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => state.sell.selectedTab);
  const contents = {
    lives: [
      {
        id: 1, //live_id
        title: "이사 준비 대정리!",
        place: "노은동",
        date: "2022-06-30",
        time: "13:00:00",
      },
      {
        id: 2,
        title: "자취 초보 분들 오세요 결혼 전에 자취방 정리 중",
        place: "송촌동",
        date: "2023-06-30",
        time: "17:00:00",
      },
      {
        id: 3,
        title: "강아지 물품 정리합니다.",
        place: "덕명동",
        date: "2024-06-30",
        time: "19:00:00",
      },
      {
        id: 4,
        title: "창고 대방출",
        place: "덕명동",
        date: "2024-08-06",
        time: "18:00:00",
      },
    ],
    shorts: [
      {
        id: "1",
        name: "빨래건조대",
        price: "0",
        place: "중리동",
        date: "2024-08-07",
        is_trade: false,
      },
      {
        id: "2",
        name: "아이패드",
        price: "60000",
        place: "중리동",
        date: "2024-08-05",
        is_trade: true,
      },
      {
        id: "3",
        name: "아이패드",
        price: "66000",
        place: "중리동",
        date: "2024-08-03",
        is_trade: false,
      },
    ],
  };
  const switchOptions = [
    { value: "lives", label: "LIVE" },
    { value: "shorts", label: "SHORTS" },
  ];

  const handleBackButtonClick = () => {
    // 이전 페이지로 이동
    navigate("/mypage");
    // 상태 초기화
    dispatch(switchTab("lives"));
  };
  return (
    <Container sx={{ py: 8 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          pb: 5,
          position: "relative",
        }}
      >
        <Box
          onClick={handleBackButtonClick}
          sx={{
            cursor: "pointer",
            position: "absolute",
            left: 0,
          }}
        >
          <ArrowBackIosNewIcon />
        </Box>
        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          판매내역
        </Typography>
      </Box>
      <Box>
        {selectedTab === "lives" && <Lives items={contents.lives} />}
        {selectedTab === "shorts" && <Shorts items={contents.shorts} />}
        <Box
          sx={{
            position: "fixed",
            bottom: 100,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Switch options={switchOptions} type="sell" />
        </Box>
      </Box>
    </Container>
  );
};

export default SellList;
