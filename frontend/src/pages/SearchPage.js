import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchSearchResults } from "../features/search/actions";
import { Container, Typography, Grid, Button, Box } from "@mui/material";
import UpcomingBroadcasts from "../components/UpcomingBroadcasts";
import LiveBroadcasts from "../components/LiveBroadcasts";
import Shorts from "../components/Shorts";
import Spinner from "../components/Spinner.js";
// import Question from "../assets/images/question.svg";

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
    if (results && results.length > 0) {
      console.log("Results updated:", results);
      setLive(results[0]?.live || []);
      setShorts(results[0]?.shorts || []);
      setUpcoming(results[0]?.upcoming || []);
      console.log("Live:", results[0]?.live);
      console.log("Shorts:", results[0]?.shorts);
      console.log("Upcoming:", results[0]?.upcoming);
    }
  }, [results]);

  const getErrorMessage = () => {
    if (error === "500") {
      return "서버 에러가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    }
    return `에러가 발생했습니다: ${error}`;
  };

  const isEmptyResults = () => {
    return (
      (!results[0]?.upcoming || results[0]?.upcoming.length === 0) &&
      (!results[0]?.live || results[0]?.live.length === 0) &&
      (!results[0]?.shorts || results[0]?.shorts.length === 0)
    );
  };

  return (
    <Container sx={{ mt: 10, mb: 10 }}>
      {loading && <Spinner />}
      {error && <Typography color="error">{getErrorMessage()}</Typography>}
      {!loading && !error && results && (
        isEmptyResults() ? (
          <Box sx={{ mt: '100%', textAlign: 'center' }}>
            {/* <img src={Question} alt="No results" style={{ width: '100px', height: '100px' }} /> */}
            <Typography 
            sx={{ 
              color: "gray",
              fontSize: "20px",
              letterSpacing: "-0.5px"
              }}>
              {query}의 검색 결과가 없습니다!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {upcoming.length > 0 && <UpcomingBroadcasts items={upcoming} />}
            {shorts.length > 0 && (
              <>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: "10px"
                    }}
                  >
                    <Typography
                    sx={{ 
                      mt: upcoming.length === 0 ? "4%" : 0,
                      fontSize: "20px",
                      fontWeight: "600",
                      letterSpacing: "-0.5px",
                      color: "#2E2E32",
                      fontFamily: "Noto Sans KR"
                      }}>SHORTS</Typography>
                    {shorts.length > 2 && (
                    <Button onClick={() => navigate(`/search/shorts?query=${query}`)}>
                      모두보기
                    </Button>
                    )}
                  </Box>
                </Grid>
                <Shorts items={shorts.slice(0, 2)} />
              </>
            )}
            {live.length > 0 && (
              <>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                       mt: "10px"
                    }}
                  >
                    <Typography sx={{ 
                      mt: upcoming.length && shorts.length === 0 ? "4%" : 0,
                      fontSize: "20px",
                      fontWeight: "600",
                      letterSpacing: "-0.5px",
                      color: "#2E2E32"
                      }}>LIVE</Typography>
                    {live.length > 2 && (
                    <Button onClick={() => navigate(`/search/live?query=${query}`)}>
                      모두보기
                    </Button>
                    )}
                  </Box>
                </Grid>
                <LiveBroadcasts items={live.slice(0, 2)} />
              </>
            )}
          </Grid>
        )
      )}
    </Container>
  );
};

export default SearchPage;
