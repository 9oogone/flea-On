import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Grid, Button } from "@mui/material";
import {
  LocationOn,
  FavoriteBorderRounded,
  FavoriteRounded,
} from "@mui/icons-material";
import { toggleScrap } from "../features/shorts/shortsSlice";
import { useNavigate } from "react-router-dom"; // 최신 버전 React Router 사용

const Shorts = ({ items = [] }) => { 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("Shorts items:", items);

  if (!items || items.length === 0) {
    return <div>No shorts available.</div>;
  }

  const handleButtonClick = (shortsId) => {
    navigate(`/shorts/${shortsId}`);
  };

  const handleScrapToggle = (id) => {
    dispatch(toggleScrap({ shortsId: id }));
  };

  return (
    <Grid item xs={12}>
      <Grid container>
        {items.map((item) => (
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
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      p: 1,
                      cursor: "pointer",
                      zIndex: 1,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleScrapToggle(item.id);
                    }}
                  >
                    {item.scrap ? (
                      <FavoriteRounded sx={{ color: "#FF0B55" }} />
                    ) : (
                      <FavoriteBorderRounded />
                    )}
                  </Box>
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
                        {item.productName}
                      </Typography>
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: 8,
                          fontWeight: 400,
                        }}
                      >
                        <LocationOn sx={{ fontSize: "8px" }} />
                        {item.tradePlace}
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
                        {item.productPrice}원
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
