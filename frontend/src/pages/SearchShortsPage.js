import React from "react";
import { Container, Typography, CircularProgress, Box } from "@mui/material";
import { useSelector } from "react-redux";
import Shorts from "../components/Shorts";
import { useLocation } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchShorts = () => {
  const query = useQuery().get("query");
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
  //   if (loading) {
  //     return (
  //       <Container>
  //         <CircularProgress />
  //       </Container>
  //     );
  //   }
  //   if (error) {
  //     return (
  //       <Container>
  //         <Typography color="error">에러가 발생했습니다: {error}</Typography>
  //       </Container>
  //     );
  //   }

  return (
    <Container>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <ArrowBackIosIcon />
        <Typography variant="h4">{query}</Typography>
      </Box>
      <Shorts items={results.shorts} />
    </Container>
  );
};

export default SearchShorts;
