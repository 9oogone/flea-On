import React from "react";
import { Box, Typography } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { isBefore, isToday, formatDistance, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

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

const Buys = ({ items }) => {
  const getStatus = (date, time) => {
    const itemDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (isBefore(itemDateTime, now)) {
      if (isToday(itemDateTime)) {
        return { text: "거래 중", color: "#FF5757" };
      } else {
        return { text: "거래완료", color: "#CCCCCC" };
      }
    } else {
      return { text: "거래예정", color: "#FF0B55" };
    }
  };

  const getRelativeDate = (date) => {
    const itemDate = parseISO(date);
    const now = new Date();
    const distance = formatDistance(itemDate, now, {
      addSuffix: true,
      locale: ko,
    });

    return distance;
  };
  return (
    <Box>
      {items.map((item) => {
        const status = getStatus(item.date, item.time);
        return (
          <Box
            key={item.id}
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
                    {item.name}
                  </Typography>
                  <Box
                    sx={{
                      width: 60,
                      height: 24,
                      backgroundColor: status.color,
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
                      {status.text}
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
                  {item.place} · {getRelativeDate(item.date)}
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
                  {formatPrice(item.price)}
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
          </Box>
        );
      })}
    </Box>
  );
};

export default Buys;
