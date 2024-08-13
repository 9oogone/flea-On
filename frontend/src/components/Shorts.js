import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import {
  LocationOn,
  FavoriteBorderRounded,
  FavoriteRounded,
} from "@mui/icons-material";
import baseAxios from "../utils/httpCommons";
import { useNavigate } from "react-router-dom";

const Shorts = ({ items: initialItems }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (initialItems) {
      setItems(initialItems);
    }
  }, [initialItems]);

  const handleButtonClick = (shortsId) => {
    navigate(`/shorts/${shortsId}`);
  };

  const handleScrapToggle = async (id, currentScrap) => {
    try {
      if (currentScrap) {
        await baseAxios().delete(
          `/fleaon/shorts/{shortsId}/shortsScrap?shortsId=${id}`
        );
      } else {
        await baseAxios().post(
          `/fleaon/shorts/{shortsId}/shortsScrap?shortsId=${id}`
        );
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, isScrap: !currentScrap } : item
        )
      );
    } catch (error) {
      console.error("Error toggling scrap:", error);
    }
  };

  if (!items || items.length === 0) {
    return <div>No shorts available.</div>;
  }

  return (
    <Grid item xs={12}>
      <Grid container>
        {items.map((item) => (
          <Grid key={item.id} item xs={6} sx={{ textAlign: "center" }}>
            <Box
              onClick={() => handleButtonClick(item.id)}
              sx={{
                padding: 0,
                minWidth: 0,
                cursor: "pointer",
                width: "16vh",
                height: "28vh",
                backgroundImage: `url(${item.shortsThumbnail})`,
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
                    handleScrapToggle(item.id, item.isScrap);
                  }}
                >
                  {item.isScrap ? (
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
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Shorts;
