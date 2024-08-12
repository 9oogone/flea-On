import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { formatPrice, getRelativeDate } from "../../../utils/cssUtils";

const Buys = ({ items }) => {
  const [buy, setBuy] = useState();
  const [buyDone, setBuyDone] = useState();
  useEffect(() => {
    setBuy(items.purchases);
    setBuyDone(items.tradeDoneResponses);
  }, [items]);
  // console.log(buy);
  // console.log(buyDone);

  return (
    <Box>
      {buy?.map((item, index) => {
        <Box
          key={index}
          sx={{
            width: "100%",
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
              width: "100%",
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
                    fontFamily: "Noto Sans",
                    fontWeight: 400,
                    lineHeight: "22px",
                    wordWrap: "break-word",
                  }}
                >
                  {item.productName}
                </Typography>
                <Box
                  sx={{
                    width: 60,
                    height: 24,
                    backgroundColor: "#FF0B55",
                    borderRadius: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
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
                {item.dongName} · {getRelativeDate(item.tradeDate)}
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
                  상세보기
                </Typography>
                <ChevronRight />
              </Box>
            </Box>
          </Box>
        </Box>;
      })}
      {buyDone?.map((item, index) => {
        <Box
          key={index}
          sx={{
            width: "100%",
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
              width: "100%",
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
                    fontFamily: "Noto Sans",
                    fontWeight: 400,
                    lineHeight: "22px",
                    wordWrap: "break-word",
                  }}
                >
                  {item.productName}
                </Typography>
                <Box
                  sx={{
                    width: 60,
                    height: 24,
                    backgroundColor: "#CCCCCC",
                    borderRadius: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: 12,
                      color: "white",
                    }}
                  >
                    거래완료
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
                {getRelativeDate(item.tradeDate)}
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
                  상세보기
                </Typography>
                <ChevronRight />
              </Box>
            </Box>
          </Box>
        </Box>;
      })}
    </Box>
  );
};

export default Buys;
