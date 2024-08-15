import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Grid, Container,Badge } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import baseAxios from "../utils/httpCommons";

const SearchForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [unread,setUnread] =useState(0)

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
  const fetchAlarm = () => {
    baseAxios()
      .get(`/fleaon/alarms/unread`)
      .then((res) => {
        setUnread(res.data.length)
      }).catch((err)=>{
        if (err.response && err.response.status === 404) {
          console.log("데이터 없음")
        }
      });
  };

  useEffect(() => {
    fetchAlarm();
  }, []);

  return (
    <Container
      sx={{
        position: "fixed",
        zIndex: 3,
        backgroundColor: "white",
        height: "12vh",
        top: 0,
      }}
    >
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
              <Badge
        variant="dot"
        color="error"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiBadge-dot': {
            backgroundColor: '#FF0B55',
            marginTop:'2px',
            marginRight:'2px',
            width: '10px',
            height: '10px',
          },
        }}
        invisible={unread===0} // hasUnread가 false면 배지가 보이지 않게 설정
      >
        <NotificationsIcon />
      </Badge>
            </IconButton>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default SearchForm;
