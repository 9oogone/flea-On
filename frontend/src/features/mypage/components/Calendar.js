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
import Trade from "../../../assets/images/trade.svg";
import TradeDone from "../../../assets/images/trade_done.svg";
import "../../../styles/Calendar.css";

const Calendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const startDate = startOfWeek(currentWeek, { weekStartsOn: 0 });

  // 오늘 날짜를 계산
  const today = new Date();

  // 더미 거래 데이터 생성
  const dummyTransactions = {
    1: { count: 3 },
    2: { count: 1 },
    3: { count: 0 },
    4: { count: 2 },
    5: { count: 4 },
    6: { count: 1 },
    7: { count: 0 },
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  // 주간 날짜 배열 생성
  const generateWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      dates.push({
        date: format(day, "d"),
        isToday: isToday(day),
      });
    }
    return dates;
  };

  return (
    <Box className="calendar-container">
      <Box className="calendar-header">
        <Box className="calendar-header-top">
          <Typography variant="h6" className="month-text">
            {format(currentWeek, "M월")}
          </Typography>
          <Box className="transaction-box">
            <Box className="transaction-icon">
              <ShoppingCart />
            </Box>
            <Typography className="transaction-text">2</Typography>
            <Box className="transaction-icon">
              <Sell />
            </Box>
            <Typography className="transaction-text">5</Typography>
            <Box className="transaction-icon">
              <img src={TradeDone} alt="거래완료아이콘" />
            </Box>
            <Typography className="transaction-text">3</Typography>
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
              <Typography>{day}</Typography>
            </Box>
          ))}
        </Box>
        <Box className="calendar-trade">
          {Object.entries(dummyTransactions).map(([date, { count }]) => (
            <Box key={date} className="trade-box">
              <img src={Trade} alt="거래아이콘" />
              <Typography>{count}</Typography>
            </Box>
          ))}
        </Box>
        <Box className="calendar-footer">
          {generateWeekDates().map(({ date, isToday }) => (
            <Box key={date} className="footer-date-box">
              <Box
                className={`footer-date-icon ${
                  isToday ? "footer-date-icon-active" : ""
                }`}
              >
                <Typography
                  className={`footer-date-text ${
                    isToday ? "footer-date-text-active" : ""
                  }`}
                >
                  {date}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
