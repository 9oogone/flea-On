import React from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom"; // 최신 버전 React Router 사용

const LiveBroadcasts = ({ items }) => {
  const navigate = useNavigate(); // navigate 함수 생성

  const handleButtonClick = (liveId) => {
    navigate(`/live/${liveId}`);
  };

  return (
    <Grid container>
      {items.map((item) => (
        <Grid key={item.id} item xs={6}>
          <Button
            onClick={() => handleButtonClick(item.live_id)}
            sx={{ padding: 0, minWidth: 0 }}
          >
            <Box
              sx={{
                width: 144,
                height: 234,
                backgroundImage: `url(${item.thumbnail})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 2,
                boxShadow: "0px -40px 20px rgba(0, 0, 0, 0.25) inset",
                mb: 2,
                mt: 2,
                p: 1,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  height: "85%",
                }}
              >
                <Box
                  sx={{
                    padding: "3px",
                    position: "absolute",
                    background: "#FF0B55",
                    borderRadius: 16,
                    zIndex: "1",
                  }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: 8,
                      lineHeight: "8px",
                    }}
                  >
                    LIVE
                  </Typography>
                </Box>
                <Box
                  sx={{
                    padding: "3px",
                    left: 15,
                    position: "absolute",
                    background: "rgba(0, 0, 0, 0.20)",
                    borderRadius:
                      "0px 100px 100px 0px / 100px 100px 100px 100px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      width: "38px",
                      fontSize: 6,
                      fontWeight: 400,
                      textAlign: "right",
                      lineHeight: "8px",
                    }}
                  >
                    3명 시청 중
                  </Typography>
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
                      {item.name}
                    </Typography>
                    <Typography
                      sx={{
                        color: "white",
                        fontSize: 8,
                        fontWeight: 400,
                      }}
                    >
                      <LocationOnIcon sx={{ fontSize: "8px" }} />
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
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: "white",
                        fontSize: 10,
                        fontWeight: 500,
                      }}
                    >
                      {item.price}원
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default LiveBroadcasts;
