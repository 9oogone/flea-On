import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // react-router-dom을 사용하여 페이지 이동 처리
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";

const SearchForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <Grid container alignItems="center" spacing={1}>
        <Grid item xs={10}>
          <TextField
            fullWidth
            type="search"
            label={<SearchIcon />}
            value={searchQuery}
            onChange={handleInputChange}
            InputProps={{
              style: {
                borderRadius: "9999px",
                // border: "1px solid #d9d9d9",
              },
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton
            onClick={handleNotificationsClick}
            style={{ width: "100%", height: "100%" }}
          >
            <NotificationsIcon />
          </IconButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default SearchForm;
