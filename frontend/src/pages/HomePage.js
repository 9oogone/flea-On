// HomePage.js
import React from "react";
import { useSelector } from "react-redux";
import Switch from "../components/Switch";
import LiveBroadcasts from "../components/LiveBroadcasts";
import Shorts from "../components/Shorts";
import { Grid, Box, Container } from "@mui/material";
const HomePage = () => {
  const selectedTab = useSelector((state) => state.content.selectedTab);
  // const contents = useSelector((state) => state.content.contents);
  const contents = {
    live: [
      {
        id: 2,
        name: "웜업탑",
        price: 5000,
        title: "aloyoga 기능성",
        trade_place: "덕명동",
        thumbnail: "https://picsum.photos/160/250",
        live_id: 2,
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
      },
      {
        id: 4,
        name: "웜업탑",
        price: 5000,
        title: "aloyoga 기능성",
        trade_place: "덕명동",
        thumbnail: "https://picsum.photos/160/250",
        live_id: 2,
        is_scrap: true,
        is_live: true,
        live_date: "오늘 오후 8시",
      },
      {
        id: 1,
        name: "웜업탑",
        price: 5000,
        title: "aloyoga 기능성",
        trade_place: "덕명동",
        thumbnail: "https://picsum.photos/160/250",
        live_id: 1,
        is_scrap: true,
        is_live: false,
        live_date: "오늘 오후 8시",
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
    { value: "live", label: "Live" },
    { value: "shorts", label: "Shorts" },
  ];

  return (
    <Container>
      <Grid container spacing={3} sx={{ marginTop: "12vh" }}>
        {selectedTab === "live" && <LiveBroadcasts items={contents.live} />}
        {selectedTab === "shorts" && <Shorts items={contents.shorts} />}
        <Box
          sx={{
            position: "fixed",
            bottom: 100,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Switch options={switchOptions} />
        </Box>
      </Grid>
    </Container>
  );
};

export default HomePage;
