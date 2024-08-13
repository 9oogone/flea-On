import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { extractDong, getRelativeDate } from "../../../utils/cssUtils";

const Live = ({ items }) => {
  console.log(items);
  const upcomingItems = items.filter((item) => item.isLive === 0);
  const completedItems = items.filter((item) => item.isLive === 2);

  return (
    <Box>
      {upcomingItems.length > 0 && (
        <Box sx={{ pb: 4, px: 0 }}>
          <Box
            sx={{
              pb: 1,

              borderBottom: "1px solid rgba(84, 84, 86, 0.34)",
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: "600", px: 1 }}>
              예정된 라이브
            </Typography>
          </Box>
          {upcomingItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                py: 2,
                borderTop: "0.33px solid rgba(84, 84, 86, 0.34)",
              }}
            >
              <Box
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  display: "flex",
                  gap: 1,
                  px: 1,
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
                      fontSize: 18,
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
      )}
      {completedItems.length > 0 && (
        <Box sx={{ px: 0 }}>
          <Box
            sx={{
              pb: 1,

              borderBottom: "1px solid rgba(84, 84, 86, 0.34)",
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: "600", px: 1 }}>
              종료된 라이브
            </Typography>
          </Box>
          {completedItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                width: "100%",
                height: "100%",
                py: 2,
                borderTop: "0.33px solid rgba(84, 84, 86, 0.34)",
              }}
            >
              <Box
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  display: "flex",
                  gap: 1,
                  px: 1,
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
                      fontSize: 18,
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
      )}
      {upcomingItems.length === 0 && completedItems.length === 0 && (
        <Box>
          <Typography sx={{ textAlign: "center" }}>
            아직 라이브를 하지 않았어요.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Live;
