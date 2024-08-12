import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import { ShoppingCart, Sell, PlaceOutlined } from "@mui/icons-material";
import { formatTime, formatPrice } from "../../../utils/cssUtils";

const CalendarTrade = ({ userId, dateTrade }) => {
  const [trade, setTrade] = useState([]);
  const [tradeDone, setTradeDone] = useState([]);
  console.log(tradeDone[0]);
  useEffect(() => {
    setTrade(dateTrade?.dayTradeResponses || []);
    setTradeDone(dateTrade?.tradeDoneSchedules || []);
  }, [dateTrade]);

  // 동 이름을 기준으로 trade 배열을 그룹화
  const groupedTrades = trade.reduce((acc, curr) => {
    const { dongName } = curr;
    if (!acc[dongName]) {
      acc[dongName] = [];
    }
    acc[dongName].push(curr);
    return acc;
  }, {});

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {Object.keys(groupedTrades).length > 0 &&
        Object.entries(groupedTrades).map(([dongName, trades]) => (
          <Box
            key={dongName}
            sx={{
              alignSelf: "stretch",
              display: "flex",
              flexDirection: "column",
              pt: 2,
            }}
          >
            <Box
              sx={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1,
                pb: 1,
              }}
            >
              <PlaceOutlined />
              <Typography
                sx={{
                  color: "rgba(0, 0, 0, 0.90)",
                  fontSize: 16,
                  fontFamily: "Noto Sans",
                  fontWeight: "900",
                  lineHeight: "22.40px",
                }}
              >
                {dongName}
              </Typography>
            </Box>

            <Box
              sx={{
                alignSelf: "stretch",
                pt: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              {trades.map((trade, index) => (
                <Box
                  key={index}
                  sx={{
                    alignSelf: "stretch",
                    px: 1,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                    }}
                  >
                    {trade.buyerId === userId ? (
                      <ShoppingCart />
                    ) : trade.sellerId === userId ? (
                      <Sell />
                    ) : null}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "rgba(0, 0, 0, 0.90)",
                          fontSize: 14,
                          fontFamily: "Noto Sans",
                          fontWeight: "400",
                        }}
                      >
                        {trade.tradePlace}
                      </Typography>
                      <Typography
                        sx={{
                          color: "rgba(0, 0, 0, 0.90)",
                          fontSize: 10,
                          fontFamily: "Noto Sans",
                          fontWeight: "400",
                        }}
                      >
                        {trade.productName} · {formatPrice(trade.price)}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "rgba(0, 0, 0, 0.90)",
                        fontSize: 14,
                        fontFamily: "Noto Sans",
                        fontWeight: "400",
                      }}
                    >
                      {formatTime(trade.tradeTime)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      {tradeDone.length > 0 && (
        <Box
          sx={{
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            pt: 2,
          }}
        >
          <Box
            sx={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1,
              pb: 1,
            }}
          >
            <PlaceOutlined />
            <Typography
              sx={{
                color: "rgba(0, 0, 0, 0.90)",
                fontSize: 16,
                fontFamily: "Noto Sans",
                fontWeight: "900",
                lineHeight: "22.40px",
              }}
            >
              거래완료
            </Typography>
          </Box>

          <Box
            sx={{
              alignSelf: "stretch",
              pt: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            {tradeDone.map((trade, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: "stretch",
                  px: 1,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  {trade.buyerId === userId ? (
                    <ShoppingCart />
                  ) : trade.sellerId === userId ? (
                    <Sell />
                  ) : null}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "rgba(0, 0, 0, 0.90)",
                        fontSize: 14,
                        fontFamily: "Noto Sans",
                        fontWeight: "400",
                      }}
                    >
                      {trade.tradePlace}
                    </Typography>
                    <Typography
                      sx={{
                        color: "rgba(0, 0, 0, 0.90)",
                        fontSize: 10,
                        fontFamily: "Noto Sans",
                        fontWeight: "400",
                      }}
                    >
                      {trade.productName} · {formatPrice(trade.productPrice)}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "rgba(0, 0, 0, 0.90)",
                      fontSize: 14,
                      fontFamily: "Noto Sans",
                      fontWeight: "400",
                    }}
                  >
                    {formatTime(trade.tradeTime)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CalendarTrade;
