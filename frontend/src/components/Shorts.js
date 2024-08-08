import React, { useState } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import {
  LocationOn,
  FavoriteBorderRounded,
  FavoriteRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // 최신 버전 React Router 사용

const Shorts = ({ items }) => {
  const [shortItems, setShortItems] = useState(items);
  const navigate = useNavigate(); // navigate 함수 생성

  const handleButtonClick = (shortsId) => {
    navigate(`/shorts/${shortsId}`);
  };

  const toggleFavorite = (id) => {
    setShortItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, is_scrap: !item.is_scrap } : item
      )
    );
  };

  return (
    <Grid item xs={12}>
      <Grid container>
        {shortItems.map((item) => (
          <Grid key={item.id} item xs={6} sx={{ textAlign: "center" }}>
            <Button
              onClick={() => handleButtonClick(item.shorts_id)}
              sx={{ padding: 0, minWidth: 0 }}
            >
              <Box
                sx={{
                  width: "16vh",
                  height: "28vh",
                  backgroundImage: `url(${item.thumbnail})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 2,
                  boxShadow: "0px -40px 20px rgba(0, 0, 0, 0.25) inset",
                  mb: 2,
                  p: 1,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: "85%",
                    textAlign: "end",
                    color: "white",
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // 부모 요소의 클릭 이벤트가 트리거되지 않도록 방지
                    toggleFavorite(item.id);
                  }}
                >
                  {item.is_scrap ? (
                    <FavoriteRounded sx={{ color: "#FF0B55" }} />
                  ) : (
                    <FavoriteBorderRounded />
                  )}
                </Box>
                <Box
                  sx={{
                    top: 206,
                    left: "7.50px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: 8,
                          fontWeight: 400,
                        }}
                      >
                        <LocationOn sx={{ fontSize: "8px" }} />
                        {item.trade_place}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: 10,
                          fontWeight: 500,
                        }}
                      >
                        {item.price}원
                      </Typography>
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: 10,
                          fontWeight: 500,
                        }}
                      >
                        {item.length}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Shorts;
