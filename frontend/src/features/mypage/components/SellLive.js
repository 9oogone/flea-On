import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLiveDetail } from "../../live/actions";
import { Box, Typography, Button } from "@mui/material";
import { format } from "date-fns";
import { getRelativeDate } from "../../../utils/cssUtils";
import UpcomingModal from "../../../components/UpcomingModal";
import { ChevronRight } from "@mui/icons-material";

const Live = ({ items }) => {
  console.log(items);
  const dispatch = useDispatch();
  const upcomingItems = items.filter((item) => item.isLive === 0);
  const completedItems = items.filter((item) => item.isLive === 2);

  const [open, setOpen] = useState(false);
  const liveDetail = useSelector((state) => state.live.liveDetail);

  const handleButtonClick = async (item) => {
    try {
      await dispatch(fetchLiveDetail(item.liveId));
      setOpen(true);
    } catch (error) {
      console.error("Live detail fetch error:", error);
    }
  };
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        height: "auto",
        display: "flex",
        gap: 4,
        flexDirection: "column",
        width: "100%",
      }}
    >
      {upcomingItems.length > 0 && (
        <Box
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              width: "90%",
              pb: 1,
              backgroundColor: "white",
              borderBottom: "1px solid rgba(84, 84, 86, 0.34)",
              position: "sticky",
              top: "79px",
              zIndex: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: "600",
                px: 1,
              }}
            >
              예정된 라이브
            </Typography>
          </Box>
          <Box
            sx={{
              top: "105px",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {upcomingItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  width: "90%",
                  height: "100%",
                  py: 2,
                  borderBottom: "0.33px solid rgba(84, 84, 86, 0.34)",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    display: "flex",
                    width: "95%",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      display: "flex",
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "black",
                        fontSize: 17,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        alignSelf: "stretch",
                        color: "rgba(128, 128, 128, 0.55)",
                        fontSize: 11,
                        wordWrap: "break-word",
                      }}
                    >
                      {item.dongName} ·
                      {getRelativeDate(format(item.liveDate, "yyyy-MM-dd"))}
                    </Typography>
                  </Box>

                  {/* <Button
                    sx={{
                      backgroundColor: "#FF0B55",
                      color: "white",
                      fontSize: 12,
                      borderRadius: 2,
                      justifyContent: "flex-start",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    수정하기
                  </Button> */}
                  <Box
                    sx={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                      display: "flex",
                    }}
                    onClick={() => handleButtonClick(item)}
                  >
                    <Typography
                      sx={{
                        color: "rgba(0, 0, 0, 0.90)",
                        fontSize: 14,
                        letterSpacing: "0.1px",
                      }}
                    >
                      상세보기
                    </Typography>
                    <ChevronRight />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      {completedItems.length > 0 && (
        <Box
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              width: "90%",
              pb: 1,
              backgroundColor: "white",
              borderBottom: "1px solid rgba(84, 84, 86, 0.34)",
              position: "sticky",
              top: "79px",
              zIndex: 1,
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: "600", px: 1 }}>
              종료된 라이브
            </Typography>
          </Box>
          <Box
            sx={{
              top: "79px",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {completedItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  width: "90%",
                  height: "100%",
                  py: 2,
                  borderTop: "0.33px solid rgba(84, 84, 86, 0.34)",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    display: "flex",
                    gap: 1,
                    width: "95%",
                  }}
                >
                  <Box
                    sx={{
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      display: "flex",
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "black",
                        fontSize: 17,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        alignSelf: "stretch",
                        color: "rgba(128, 128, 128, 0.55)",
                        fontSize: 11,
                        wordWrap: "break-word",
                      }}
                    >
                      {item.dongName} ·
                      {getRelativeDate(format(item.liveDate, "yyyy-MM-dd"))}
                    </Typography>
                  </Box>

                  {/* <Button
                    sx={{
                      backgroundColor: "#cccccc",
                      color: "white",
                      fontSize: 12,
                      borderRadius: 2,
                      justifyContent: "flex-start",
                      alignItems: "center",
                      display: "flex",
                    }}
                    onClick={() => handleButtonClick(item)}
                  >
                    상세보기
                  </Button> */}
                  <Box
                    sx={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                      display: "flex",
                    }}
                    onClick={() => handleButtonClick(item)}
                  >
                    <Typography
                      sx={{
                        color: "rgba(0, 0, 0, 0.90)",
                        fontSize: 14,
                        letterSpacing: "0.1px",
                      }}
                    >
                      상세보기
                    </Typography>
                    <ChevronRight />
                  </Box>
                  {liveDetail.liveId && (
                    <UpcomingModal
                      id={index}
                      open={open}
                      handleClose={handleClose}
                      liveDetail={liveDetail}
                    />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      {upcomingItems.length === 0 && completedItems.length === 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <Typography sx={{ textAlign: "center" }}>
            현재 판매 중인 라이브 방송이 없습니다. <br />
            새로운 라이브를 시작해 볼까요?"
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Live;
