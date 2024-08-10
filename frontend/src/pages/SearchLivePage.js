import React, { useEffect } from "react";
import { Container, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchSearchResults } from "../features/search/actions";
import LiveBroadcasts from "../components/LiveBroadcasts";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

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
      <ArrowBackIosIcon sx={{ cursor: "pointer" }} onClick={handleIconClick} />
      <Typography variant="h4" gutterBottom sx={{ display: "inline-block" }}>
        {query}
      </Typography>

      {loading && <CircularProgress />}
      {error && <Typography color="error">에러가 발생했습니다: {error === "500" ? "서버 에러가 발생했습니다. 잠시 후 다시 시도해 주세요." : error}</Typography>}

      <LiveBroadcasts items={results.live ? results.live : []} />
    </Container>
  );
};

export default SearchLive;
