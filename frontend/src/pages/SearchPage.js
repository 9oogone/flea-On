import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchSearchResults } from "../features/search/actions";
import { Container, Typography, Grid, CircularProgress } from "@mui/material";
import UpcomingBroadcasts from "../components/UpcomingBroadcasts";
import LiveBroadcasts from "../components/LiveBroadcasts";
import Shorts from "../components/Shorts";
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchPage = () => {
  const dispatch = useDispatch();
  const query = useQuery().get("query");
  //   const { loading, results, error } = useSelector((state) => state.search);

  useEffect(() => {
    dispatch(fetchSearchResults(query));
  }, [dispatch, query]);
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
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        검색 결과: {query}
      </Typography>

      {/* {loading && <CircularProgress />}
      {error && <Typography color="error">에러가 발생했습니다: {error}</Typography>} */}

      <Grid container spacing={3}>
        <UpcomingBroadcasts items={results.upcoming} />
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>
            쇼츠
          </Typography>
          <Shorts items={results.shorts} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>
            라이브 방송
          </Typography>
          <LiveBroadcasts items={results.live} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchPage;
