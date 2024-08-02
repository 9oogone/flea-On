import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Grid, Container } from "@mui/material";
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
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid container alignItems="center" spacing={1} sx={{ mt: 2 }}>
          <Grid item xs={10}>
            <TextField
              fullWidth
              type="search"
              label={<SearchIcon />}
              value={searchQuery}
              onChange={handleInputChange}
              InputProps={{
                style: {
                  borderRadius: "100px",
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
    </Container>
  );
};

export default SearchForm;
