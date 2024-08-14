import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import {
  LocationOn,
  FavoriteBorderRounded,
  FavoriteRounded,
} from "@mui/icons-material";
import baseAxios from "../utils/httpCommons";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/cssUtils";
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
    return <div> 숏츠가 없습니다.</div>;
  }

  return (
    <Grid item xs={12}>
      <Grid container>
        {items && items.length > 0 ? (
          items.map((item) => (
            <Grid
              key={item.id}
              item
              xs={6}
              sx={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button onClick={() => handleButtonClick(item.id)}>
                <Box
                  sx={{
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
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        p: 1,
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScrapToggle(item.id, item.isScrap);
                      }}
                    >
                      {item.isScrap ? (
                        <FavoriteRounded sx={{ color: "#FF0B55" }} />
                      ) : (
                        <FavoriteBorderRounded sx={{ color: "white" }} />
                      )}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      top: 206,
                      left: "7.50px",
                      width: "100%",
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "space-between",
                            alignItems: "center",
                            textAlign: "flex-start",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "white",
                              width: "70%",
                              fontSize: 14,
                              fontWeight: 600,
                              textAlign: "left",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.productName}
                          </Typography>
                          <Typography
                            sx={{
                              color: "white",
                              fontSize: 8,
                              fontWeight: 400,
                              mr: 0.6,
                            }}
                          >
                            <LocationOn sx={{ fontSize: "8px" }} />
                            {item.dongName}
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
                              textAlign: "left",
                            }}
                          >
                            {formatPrice(item.productPrice)}
                          </Typography>
                          <Box
                            sx={{
                              px: 0.6,
                              py: 0.3,
                              backgroundColor: "rgba(128, 128, 128, 0.55)",
                              borderRadius: 2,
                              overflow: "hidden",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
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
                  </Box>
                </Box>
              </Button>
            </Grid>
          ))
        ) : (
          <Grid item xs={12} sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              쇼츠가 없습니다.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default Shorts;
