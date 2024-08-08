import React from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { FavoriteRounded } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const WatchlistShorts = ({ items }) => {
  const navigate = useNavigate();

  const handleButtonClick = (shortsId) => {
    navigate(`/shorts/${shortsId}`);
  };

  return (
    <Grid item xs={12}>
      <Grid container>
        {items
          .filter((item) => item.is_scrap)
          .map((item) => (
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
                    <FavoriteRounded sx={{ color: "#FF0B55" }} />
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

export default WatchlistShorts;
