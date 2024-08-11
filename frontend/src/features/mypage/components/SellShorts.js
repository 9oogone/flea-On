import React from "react";
import { Box, Typography } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import {
  formatPrice,
  extractDong,
  getRelativeDate,
} from "../../../utils/cssUtils";
///// 왜 배열이 아니고 객체로 오지...??...
const Shorts = ({ items }) => {
  console.log(items);
  return (
    <Box>
      <Box sx={{ pb: 4, px: 0 }}>
        <Box
          sx={{
            pb: 1,
            borderBottom: "1px solid rgba(84, 84, 86, 0.34)",
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: "600", px: 1 }}>
            판매 쇼츠
          </Typography>
        </Box>
        {items.length === 0 ? (
          <Typography variant="h6" sx={{ color: "grey.700" }}>
            아직 판매 쇼츠가 없어요.
          </Typography>
        ) : (
          items.map((item) => {
            return (
              <Box
                key={item.shortsId}
                sx={{
                  width: "100%",
                  height: "100%",
                  py: 2,
                  borderTop: "0.33px solid rgba(84, 84, 86, 0.34)",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    display: "flex",
                    width: "100%",
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
                    <Box
                      sx={{
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 0.6,
                        display: "flex",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "black",
                          fontSize: 18,
                        }}
                      >
                        {item.productName}
                      </Typography>
                      <Box
                        sx={{
                          width: 60,
                          height: 24,
                          borderRadius: 2,
                          justifyContent: "center",
                          alignItems: "center",
                          display: "flex",
                          bgcolor: "#FF0B55",
                          // backgroundColor: item.is_trade
                          //   ? "#FF5757"
                          //   : "#FF0B55",
                        }}
                      >
                        <Typography
                          sx={{
                            textAlign: "center",
                            fontSize: 12,
                            color: "white",
                          }}
                        >
                          거래예정
                          {/* {item.is_trade ? "거래예정" : "판매 중"} */}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        alignSelf: "stretch",
                        color: "rgba(128, 128, 128, 0.55)",
                        fontSize: 11,
                        wordWrap: "break-word",
                      }}
                    >
                      {extractDong(item.tradePlace)} ·{" "}
                      {/* {getRelativeDate(item.date)} */}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-end",
                      gap: 0.5,
                      display: "flex",
                    }}
                  >
                    <Typography
                      sx={{
                        pr: 2,
                        fontSize: 17,
                      }}
                    >
                      {formatPrice(item.productPrice)}
                    </Typography>
                    <Box
                      sx={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "black",
                          fontSize: 12,
                          letterSpacing: "0.1px",
                        }}
                      >
                        쇼츠보기
                      </Typography>
                      <ChevronRight />
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default Shorts;
