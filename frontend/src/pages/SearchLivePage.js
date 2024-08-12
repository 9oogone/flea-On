import React, { useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchSearchResults } from "../features/search/actions";
import LiveBroadcasts from "../components/LiveBroadcasts";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Spinner from "../components/Spinner.js"

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchLive = () => {
  const dispatch = useDispatch();
  const query = useQuery().get("query");
  const { loading, results, error } = useSelector((state) => state.search);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      dispatch(fetchSearchResults(query));
    }
  }, [dispatch, query]);

  useEffect(() => {
    if (error) {
      console.error("SearchLive Error:", error);
    }
  }, [error]);

  const handleIconClick = () => {
    navigate(-1);
  };

  return (
    <Container>
    <Box>
    <ArrowBackIosIcon sx={{ cursor: "pointer", mt: "7%", mb: "7%" }} onClick={handleIconClick} />
    </Box>
    <Box>
    <Typography gutterBottom sx={{ textAlign: "center", mb: "7%", fontSize: "30px", letterSpacing: "-2px" }}>
      {query}의 Live 검색 결과
    </Typography>
    </Box>

    {loading && <Spinner />}
    {error && <Typography color="error">에러가 발생했습니다: {error}</Typography>}
      <LiveBroadcasts items={results[0].live ? results[0].live : []} />
    </Container>
  );
};

export default SearchLive;
