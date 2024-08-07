import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Switch from "../../../components/Switch";
import Lives from "./WatchLives.js";
import Shorts from "./WatchShorts.js";
import { Container, Box, Grid, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { switchTab } from "../watchlistSlice.js";

const WatchList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => state.watch.selectedTab);
  const contents = {
    lives: [
      {
        id: 2,
        name: "웜업탑",
        price: 5000,
        title: "aloyoga 기능성",
        trade_place: "덕명동",
        thumbnail: "https://picsum.photos/160/250",
        live_id: 1,
        is_scrap: true,
        is_live: true,
        live_date: "오늘 오후 8시",
      },
      {
        id: 3,
        name: "웜업탑",
        price: 5000,
        title: "aloyoga 기능성",
        trade_place: "덕명동",
        thumbnail: "https://picsum.photos/160/250",
        live_id: 2,
        is_scrap: true,
        is_live: true,
        live_date: "오늘 오후 8시",
        products: [{ name: "라면", price: 3000 }],
      },
      {
        id: 4,
        name: "웜업탑",
        price: 5000,
        title: "aloyoga 기능성",
        trade_place: "덕명동",
        thumbnail: "https://picsum.photos/160/250",
        live_id: 3,
        is_scrap: true,
        is_live: true,
        live_date: "오늘 오후 8시",
        products: [{ name: "라면", price: 3000 }],
      },
      {
        id: 1,
        name: "웜업탑",
        price: 5000,
        title: "식료품 타이쿤 대방출",
        trade_place:
          "대전광역시 동구 덕명동 삼성화재연수원 유성동캠퍼스 동원가든 경비실 앞 자전거 거치대",
        thumbnail: "https://picsum.photos/160/250",
        author: "초호기딸기왕",
        live_id: 1,
        is_scrap: true,
        is_live: false,
        live_date: "오늘 오후 8시",
        products: [
          { name: "라면", price: 3000 },
          { name: "젤리", price: 3000 },
          { name: "푸딩", price: 3000 },
        ],
      },
      {
        id: 5,
        name: "웜업탑",
        price: 5000,
        title: "aloyoga 기능성",
        trade_place: "덕명동",
        thumbnail: "https://picsum.photos/160/250",
        live_id: 1,
        is_scrap: true,
        is_live: false,
        live_date: "오늘 오후 8시",
        products: [{ name: "라면", price: 3000 }],
      },
      {
        id: 6,
        name: "웜업탑",
        price: 5000,
        title: "aloyoga 기능성",
        trade_place: "덕명동",
        thumbnail: "https://picsum.photos/160/250",
        live_id: 1,
        is_scrap: true,
        is_live: false,
        live_date: "오늘 오후 8시",
        products: [{ name: "라면", price: 3000 }],
      },
      {
        id: 7,
        name: "웜업탑",
        price: 5000,
        title: "aloyoga 기능성",
        trade_place: "덕명동",
        thumbnail: "https://picsum.photos/160/250",
        live_id: 1,
        is_scrap: true,
        is_live: false,
        live_date: "오늘 오후 8시",
        products: [{ name: "라면", price: 3000 }],
      },
      {
        id: 8,
        name: "웜업탑",
        price: 5000,
        title: "aloyoga 기능성",
        trade_place: "덕명동",
        thumbnail: "https://picsum.photos/160/250",
        live_id: 1,
        is_scrap: true,
        is_live: false,
        live_date: "오늘 오후 8시",
        products: [{ name: "라면", price: 3000 }],
      },
      {
        id: 9,
        name: "웜업탑",
        price: 5000,
        title: "aloyoga 기능성",
        trade_place: "덕명동",
        thumbnail: "https://picsum.photos/160/250",
        live_id: 1,
        is_scrap: true,
        is_live: false,
        live_date: "오늘 오후 8시",
        products: [{ name: "라면", price: 3000 }],
      },
    ],
    shorts: [
      {
        id: 2,
        name: "키티템 정리",
        price: 3000,
        trade_place: "덕명동",
        length: "01:30",
        is_scrap: false,
        thumbnail: "https://picsum.photos/160/250",
        shorts_id: 1,
      },
      {
        id: 2,
        name: "키티템 정리",
        price: 3000,
        trade_place: "덕명동",
        length: "01:30",
        is_scrap: true,
        thumbnail: "https://picsum.photos/160/250",
        shorts_id: 2,
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
          관심목록
        </Typography>
      </Box>

      <Container>
        <Grid container spacing={3} sx={{ marginTop: "2vh" }}>
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
            <Switch options={switchOptions} type="watch" />
          </Box>
        </Grid>
      </Container>
    </Container>
  );
};

export default WatchList;
