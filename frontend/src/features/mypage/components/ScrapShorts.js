import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleScrap } from "../scrapSlice";
import { switchTab } from "../../../features/home/contentSlice";
import { Box, Typography, Grid, Button } from "@mui/material";
import { FavoriteRounded, LocationOn } from "@mui/icons-material";
import { formatPrice } from "../../../utils/cssUtils";

const ScrapShorts = ({ items }) => {
  // console.log(items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleNavigateToShorts = () => {
    dispatch(switchTab("shorts"));
    navigate("/");
  };

  const handleButtonClick = (shortsId) => {
    navigate(`/shorts/${shortsId}`);
  };

  const handleScrapToggle = (id) => {
    dispatch(toggleScrap({ id, type: "shorts" }));
  };

  return (
    <Grid item xs={12}>
      <Grid container>
        {items.length === 0 ? (
          <Grid item xs={12} sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6" sx={{ color: "grey.700" }}>
              관심있는 판매 쇼츠가 없어요 <br />
              한번 둘러보세요
            </Typography>
            <Button
              onClick={handleNavigateToShorts}
              sx={{
                mt: 2,
                color: "white",
                backgroundColor: "#FF0B55",
                padding: "10px 20px",
                borderRadius: 3,
                textTransform: "none",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              쇼츠 보러 가기
            </Button>
          </Grid>
        ) : (
          items.map((item, index) => (
            <Grid key={index} item xs={6} sx={{ textAlign: "center" }}>
              <Button
                onClick={() => handleButtonClick(item.shortsId)}
                sx={{ padding: 0, minWidth: 0 }}
              >
                <Box
                  sx={{
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
                        handleScrapToggle(item.shortsId);
                      }}
                    >
                      <FavoriteRounded sx={{ color: "#FF0B55" }} />
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
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
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
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "space-between",
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
              </Button>
            </Grid>
          ))
        )}
      </Grid>
    </Grid>
  );
};

export default ScrapShorts;
