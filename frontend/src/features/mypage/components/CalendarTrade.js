import React from "react";
import { Box, Typography } from "@mui/material";
import { ShoppingCart, Sell, LocationOnOutlined } from "@mui/icons-material";
import { parse, format } from "date-fns";
const CalendarTrade = ({ userId, selectedDate, trades }) => {
  const formatTime = (time) => {
    const parsedTime = parse(time, "HH:mm:ss", new Date());
    const isPM = format(parsedTime, "a") === "PM";
    const hours = parsedTime.getHours();
    const minutes = parsedTime.getMinutes();

    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const period = isPM ? "오후" : "오전";

    const formattedMinutes = minutes === 0 ? "" : `${minutes}분`;

    return `${period} ${formattedHours}시 ${formattedMinutes}`.trim();
  };

  const formatPrice = (price) => {
    if (price < 10000) {
      return `${price}원`;
    }

    const manWon = Math.floor(price / 10000);
    const rest = price % 10000;

    if (rest === 0) {
      return `${manWon}만원`;
    } else {
      return `${manWon}만 ${rest}원`;
    }
  };

  if (!selectedDate || Object.keys(trades).length === 0) {
    return null; // 아무것도 렌더링하지 않음
  }

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
      {Object.entries(trades).map(([location, dailytrades]) => (
        <Box
          key={location}
          sx={{
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            pt: 2,
          }}
        >
          <Box
            sx={{
              height: 31,
              borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1,
            }}
          >
            <LocationOnOutlined />
            <Typography
              sx={{
                color: "rgba(0, 0, 0, 0.90)",
                fontSize: 16,
                fontFamily: "Noto Sans",
                fontWeight: "900",
                lineHeight: "22.40px",
              }}
            >
              {location}
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
            {dailytrades.map((trade, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: "stretch",
                  height: 34,
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
                  {trade.buyer_id === userId ? (
                    <ShoppingCart />
                  ) : trade.seller_id === userId ? (
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
                        lineHeight: "19.60px",
                      }}
                    >
                      {trade.place}
                    </Typography>
                    <Typography
                      sx={{
                        color: "rgba(0, 0, 0, 0.90)",
                        fontSize: 10,
                        fontFamily: "Noto Sans",
                        fontWeight: "400",
                        lineHeight: "14px",
                      }}
                    >
                      {trade.product} · {formatPrice(trade.price)}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "rgba(0, 0, 0, 0.90)",
                      fontSize: 14,
                      fontFamily: "Noto Sans",
                      fontWeight: "400",
                      lineHeight: "19.60px",
                    }}
                  >
                    {formatTime(trade.time)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CalendarTrade;
