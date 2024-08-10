import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchSearchResults } from "../features/search/actions";
import { Container, Typography, Grid, CircularProgress, Button, Box } from "@mui/material";
import UpcomingBroadcasts from "../components/UpcomingBroadcasts";
import LiveBroadcasts from "../components/LiveBroadcasts";
import Shorts from "../components/Shorts";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchPage = () => {
  const dispatch = useDispatch();
  const query = useQuery().get("query");
  const { loading, results, error } = useSelector((state) => state.search);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      dispatch(fetchSearchResults(query));
    }
  }, [dispatch, query]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        검색 결과: {query}
      </Typography>

      {loading && <CircularProgress />}
      {error && <Typography color="error">에러가 발생했습니다: {error}</Typography>}

      <Grid container spacing={3}>
        <UpcomingBroadcasts items={results.upcoming} />
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
        <Shorts items={results.shorts.slice(0, 2)} />
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
        <LiveBroadcasts items={results.live.slice(0, 2)} />
      </Grid>
    </Container>
  );
};

export default SearchPage;
