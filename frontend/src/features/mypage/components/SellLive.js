import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { extractDong, getRelativeDate } from "../../../utils/cssUtils";
import { StickyNote2 } from "@mui/icons-material";

const Live = ({ items }) => {
  console.log(items);
  const upcomingItems = items.filter((item) => item.isLive === 0);
  const completedItems = items.filter((item) => item.isLive === 2);

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

                  <Button
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
                  </Button>
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

                  <Button
                    sx={{
                      backgroundColor: "#cccccc",
                      color: "white",
                      fontSize: 12,
                      borderRadius: 2,
                      justifyContent: "flex-start",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    상세보기
                  </Button>
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
            아직 라이브를 한 적이 없어요.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Live;
