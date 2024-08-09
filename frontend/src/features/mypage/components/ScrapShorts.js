import React from "react";
import { useDispatch } from "react-redux";
import { Box, Typography, Grid, Button } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { FavoriteRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toggleScrap } from "../scrapSlice";
import { switchTab } from "../../../features/home/contentSlice";

const ScrapShorts = ({ items }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log(items);
  const handleNavigateToShorts = () => {
    dispatch(switchTab("shorts"));
    navigate("/");
  };

  const handleButtonClick = (shortsId) => {
    navigate(`/shorts/${shortsId}`);
  };

  const handleScrapToggle = (id) => {
    // console.log("찍히니", id);
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
          items.map((item) => (
            <Grid key={item.shorts_id} item xs={6} sx={{ textAlign: "center" }}>
              <Button
                onClick={() => handleButtonClick(item.shorts_id)}
                sx={{ padding: 0, minWidth: 0 }}
              >
                <Box
                  sx={{
                    width: "16vh",
                    height: "28vh",
                    backgroundImage: `url(${item.shorts_thumbnail})`,
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
                        handleScrapToggle(item.shorts_id);
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
                          {/* {item.name} */}
                          상품명아 와라
                        </Typography>
                        <Typography
                          sx={{
                            color: "white",
                            fontSize: 8,
                            fontWeight: 400,
                          }}
                        >
                          <LocationOnIcon sx={{ fontSize: "8px" }} />
                          {/* {item.trade_place} */}
                          플리동
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
                          {/* {item.price}원 */}
                          3000원
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
          ))
        )}
      </Grid>
    </Grid>
  );
};

export default ScrapShorts;
