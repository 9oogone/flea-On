import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchSearchResults } from "../features/search/actions";
import { Container, Typography, Grid, Button, Box, CircularProgress } from "@mui/material";
import UpcomingBroadcasts from "../components/UpcomingBroadcasts";
import LiveBroadcasts from "../components/LiveBroadcasts";
import Shorts from "../components/Shorts";
// import Spinner from "../components/Spinner.js"

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchPage = () => {
  const dispatch = useDispatch();
  const query = useQuery().get("query");
  const { loading, results, error } = useSelector((state) => state.search);
  const [live, setLive] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      console.log("Fetching search results for query:", query);
      dispatch(fetchSearchResults(query));
    }
  }, [dispatch, query]);

  useEffect(() => {
    if (error) {
      console.error("SearchPage Error:", error);
    }
  }, [error]);

  useEffect(() => {
    if (results) {
      console.log("Results updated:", results);
      setLive(results[0].live || []);
      setShorts(results[0].shorts || []);
      setUpcoming(results[0].upcoming || []);
      console.log("Live:", results.live);
      console.log("Shorts:", results.shorts);
      console.log("Upcoming:", results.upcoming);
    }
  }, [results]);

  const getErrorMessage = () => {
    if (error === "500") {
      return "서버 에러가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    }
    return `에러가 발생했습니다: ${error}`;
  };

  return (
    <Container sx={{ mt: 10 }}>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{getErrorMessage()}</Typography>}
      {!loading && !error && results && (
        <Grid container spacing={3}>
          <UpcomingBroadcasts items={upcoming} />
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5">쇼츠</Typography>
              <Button onClick={() => navigate(`/search/shorts?query=${query}`)}>
                모두보기
              </Button>
            </Box>
          </Grid>
          <Shorts items={shorts.slice(0, 2)} />
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5">라이브</Typography>
              <Button onClick={() => navigate(`/search/live?query=${query}`)}>
                모두보기
              </Button>
            </Box>
          </Grid>
          <LiveBroadcasts items={live.slice(0, 2)} />
        </Grid>
      )}
    </Container>
  );
};

export default SearchPage;
