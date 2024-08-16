import React, { useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
// import { fetchSearchResults } from "../features/search/actions";
import Shorts from "../components/Shorts";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Spinner from "../components/Spinner.js"

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchShorts = () => {
  const dispatch = useDispatch();
  const query = useQuery().get("query");
  const { loading, results, error } = useSelector((state) => state.search);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (query) {
  //     console.log("Fetching search results for query:", query);
  //     dispatch(fetchSearchResults(query));
  //   }
  // }, [dispatch, query]);

  useEffect(() => {
    if (error) {
      console.error("SearchShorts Error:", error);
    }
  }, [error]);

  const handleIconClick = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" mb="7%">
        <ArrowBackIosIcon sx={{ ml: 2, cursor: "pointer", mt: "7%", color: "rgba(44, 44, 46, 1)", fontSize: "18px" }} onClick={handleIconClick} />
        <Typography gutterBottom sx={{ 
          mt: "7%", fontSize: "18px", letterSpacing: "-2px", color: "rgba(44, 44, 46, 1)", pt: 0.5,
          fontWeight: 500 }}>
          {query}의 SHORTS 검색 결과
        </Typography>
      </Box>

      {loading && <Spinner />}
      {error && <Typography color="error">에러가 발생했습니다: {error}</Typography>}

      <Shorts items={results[0].shorts ? results[0].shorts : []} />
    </Container>
  );
};

export default SearchShorts;
