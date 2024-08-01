// HomePage.js
import React from "react";
import { useSelector } from "react-redux";
import Switch from "../components/Switch";
import LiveBroadcasts from "../components/LiveBroadcasts";
import Shorts from "../components/Shorts";
import { Grid } from "@mui/material";
const HomePage = () => {
  const selectedTab = useSelector((state) => state.content.selectedTab);
  // const contents = useSelector((state) => state.content.contents);
  const contents = {
    live: [
      {
        id: 1,
        name: "웜업탑",
        price: 5000,
        title: "aloyoga 기능성",
        trade_place: "덕명동",
        thumbnail: "https://picsum.photos/160/250",
        live_id: 1,
        is_live: false,
        live_date: "오늘 오후 8시",
      },
      {
        id: 2,
        name: "웜업탑",
        price: 5000,
        title: "aloyoga 기능성",
        trade_place: "덕명동",
        thumbnail: "https://picsum.photos/160/250",
        live_id: 2,
        is_live: true,
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
        is_scrap: false,
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
    <Grid container>
      <Grid item xs={12}>
        {selectedTab === "live" && <LiveBroadcasts items={contents.live} />}
      </Grid>
      <Grid item xs={12}>
        {selectedTab === "shorts" && <Shorts items={contents.shorts} />}
      </Grid>
      <Switch options={switchOptions} />
    </Grid>
  );
};

export default HomePage;
