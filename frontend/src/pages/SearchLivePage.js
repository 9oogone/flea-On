import React from "react";
import { Container, Typography, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useLocation, useNavigate } from "react-router-dom";
import LiveBroadcasts from "../components/LiveBroadcasts";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchLive = () => {
  const query = useQuery().get("query");
  const navigate = useNavigate();
  //   const { loading, results, error } = useSelector((state) => state.search);
  const results = {
    upcoming: [
      {
        id: 1,
        name: "아디다스 져지",
        price: 28000,
        live_date: "오늘 오후 8시",
        title: "옷장털이갑니다",
      },
      {
        id: 2,
        name: "아디다스 져지",
        price: 28000,
        live_date: "오늘 오후 8시",
        title: "옷장털이갑니다",
      },
      {
        id: 3,
        name: "아디다스 져지",
        price: 28000,
        live_date: "오늘 오후 8시",
        title: "옷장털이갑니다",
      },
    ],
    live: [
      {
        id: 1,
        name: "웜업탑",
        price: 5000,
        title: "aloyoga 기능성",
        trade_place: "덕명동",
        thumbnail: "https://picsum.photos/160/250",
        live_id: 1,
        is_live: true,
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
  //   if (error) {
  //     return (
  //       <Container>
  //         <Typography color="error">에러가 발생했습니다: {error}</Typography>
  //       </Container>
  //     );
  //   }
  const handleIconClick = () => {
    navigate(-1);
  };
  return (
    <Container>
      <ArrowBackIosIcon sx={{ cursor: "pointer" }} onClick={handleIconClick} />
      <Typography variant="h4" gutterBottom sx={{ display: "inline-block" }}>
        {query}
      </Typography>
      <LiveBroadcasts items={results.live} />
    </Container>
  );
};

export default SearchLive;
