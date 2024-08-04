import React, { useState } from "react";
import {
  format,
  addWeeks,
  subWeeks,
  startOfWeek,
  addDays,
  isToday,
} from "date-fns";
import { Box, Typography, IconButton } from "@mui/material";
import {
  NavigateBefore,
  NavigateNext,
  ShoppingCart,
  Sell,
} from "@mui/icons-material";
import CalendarTrade from "./CalendarTrade";

import Trade from "../../../assets/images/trade.svg";
import TradeDone from "../../../assets/images/trade_done.svg";

import { ReactComponent as TradeIcon } from "../../../assets/images/trade.svg";
import { ReactComponent as TradeDoneIcon } from "../../../assets/images/trade_done.svg";
import "../../../styles/Calendar.css";

const Calendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const startDate = startOfWeek(currentWeek, { weekStartsOn: 0 });

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // 주간 날짜 배열 생성
  const generateWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      dates.push({
        date: day,
        day: format(day, "d"),
        isToday: isToday(day),
      });
    }
    return dates;
  };

  const getTradeCount = (trades) => {
    return Object.values(trades).reduce(
      (acc, locations) => acc + locations.length,
      null
    );
  };

  // 더미 거래 데이터 생성
  const userId = 1; // 임의의 사용자 ID 설정
  const dummyTrades = {
    "2024-08-01": {
      덕명동: [
        {
          place: "한밭대학교 도서관 앞",
          buyer_id: 1,
          seller_id: 2,
          product: "애플 맥북 프로",
          price: 1500000,
          time: "10:00:00",
        },
        {
          place: "삼성화재 유성연수원 경비실 앞",
          buyer_id: 3,
          seller_id: 1,
          product: "아이패드",
          price: 600000,
          time: "13:30:00",
        },
      ],
    },
    "2024-08-02": {
      덕명동: [
        {
          place: "동네카페",
          buyer_id: 1,
          seller_id: 4,
          product: "빈티지 카메라",
          price: 200000,
          time: "15:00:00",
        },
      ],
    },
    "2024-08-03": {},
    "2024-08-04": {
      덕명동: [
        {
          place: "삼성화재 유성연수원 경비실 앞",
          buyer_id: 1,
          seller_id: 5,
          product: "허먼밀러 의자",
          price: 808000,
          time: "14:00:00",
        },
        {
          place: "삼성화재 유성연수원 경비실 앞",
          buyer_id: 6,
          seller_id: 1,
          product: "정처기 필기책",
          price: 10000,
          time: "15:00:00",
        },
      ],
      봉명동: [
        {
          place: "매드블럭 옆 공터",
          buyer_id: 1,
          seller_id: 7,
          product: "무접점 키보드",
          price: 5000,
          time: "11:00:00",
        },
      ],
    },
    "2024-08-05": {},
    "2024-08-06": {},
    "2024-08-07": {
      덕명동: [
        {
          place: "삼성화재 ",
          buyer_id: 8,
          seller_id: 1,
          product: "고성능 PC",
          price: 2000000,
          time: "14:00:00",
        },
      ],
    },
  };
  return (
    <Box className="calendar-container">
      <Box className="calendar-header">
        <Box className="calendar-header-top">
          <Box className="trade-summary">
            <Typography variant="h6" className="month-text">
              {format(currentWeek, "M월")}
            </Typography>
            <Box className="trade-summary-item">
              <ShoppingCart className="trade-summary-icon" />
              <Typography className="trade-summary-text">2</Typography>
            </Box>
            <Box className="trade-summary-item">
              <Sell className="trade-summary-icon" />
              <Typography className="trade-summary-text">5</Typography>
            </Box>
            <Box className="trade-summary-item">
              <TradeDoneIcon className="trade-summary-icon" />
              <Typography className="trade-summary-text">3</Typography>
            </Box>
          </Box>
          <Box className="navigation-buttons">
            <IconButton onClick={handlePreviousWeek}>
              <NavigateBefore />
            </IconButton>
            <IconButton onClick={handleNextWeek}>
              <NavigateNext />
            </IconButton>
          </Box>
        </Box>

        <Box className="calendar-weekdays">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <Box key={day} className="weekday-text">
              <Typography className="footer-date-text">{day}</Typography>
            </Box>
          ))}
        </Box>

        <Box className="calendar-trade">
          {generateWeekDates().map(({ date }) => (
            <Box
              key={format(date, "yyyy-MM-dd")}
              className="trade-box"
              onClick={() => handleDateClick(date)}
            >
              <img src={Trade} alt="거래아이콘" />
              <Typography className="trade-text">
                {getTradeCount(dummyTrades[format(date, "yyyy-MM-dd")] || {})}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box className="calendar-footer">
          {generateWeekDates().map(({ date, day, isToday }) => {
            const isSelected =
              selectedDate && selectedDate.getTime() === date.getTime();
            return (
              <Box key={day} className="footer-date-box">
                <Box
                  className={`footer-date-icon ${
                    isToday && !isSelected
                      ? "footer-date-icon-active-today"
                      : isSelected
                      ? "footer-date-icon-active-selected"
                      : ""
                  }`}
                >
                  <Typography
                    className={`footer-date-text ${
                      isToday && !isSelected
                        ? "footer-date-text-active-today"
                        : isSelected
                        ? "footer-date-text-active-selected"
                        : ""
                    }`}
                  >
                    {day}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
      {/* 일별 거래내역 */}
      <CalendarTrade
        userId={userId}
        selectedDate={selectedDate}
        trades={
          selectedDate
            ? dummyTrades[format(selectedDate, "yyyy-MM-dd")] || {}
            : {}
        }
      />
    </Box>
  );
};

export default Calendar;
