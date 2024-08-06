import React, { useState, useEffect } from "react";
import {
  format,
  addWeeks,
  subWeeks,
  startOfWeek,
  addDays,
  isToday,
  isPast,
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

// import { ReactComponent as TradeIcon } from "../../../assets/images/trade.svg";
import { ReactComponent as TradeDoneIcon } from "../../../assets/images/trade_done.svg";
import "../../../styles/Calendar.css";

const Calendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [weeklyTrades, setWeeklyTrades] = useState({});
  // const [trades, setTrades] = useState({}); //api
  const [userId] = useState(1);

  const startDate = startOfWeek(currentWeek, { weekStartsOn: 0 });

  useEffect(() => {
    // 현재 주간 데이터 필터링
    filterWeeklyTrades();
  }, [currentWeek]);

  const filterWeeklyTrades = () => {
    const startOfWeekStr = format(startDate, "yyyy-MM-dd");
    const endOfWeekStr = format(addDays(startDate, 6), "yyyy-MM-dd");

    // 더미 데이터에서 현재 주간 데이터 필터링
    const filteredTrades = Object.keys(dummyTrades)
      .filter((date) => date >= startOfWeekStr && date <= endOfWeekStr)
      .reduce((obj, key) => {
        obj[key] = dummyTrades[key];
        return obj;
      }, {});

    setWeeklyTrades(filteredTrades);
  };
  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
    setSelectedDate(null);
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
    setSelectedDate(null);
  };

  const handleDateClick = (event, date) => {
    event.preventDefault();
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
        isPast: isPast(day),
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

  const getWeekTrades = (trades, userId) => {
    let purchaseCount = 0;
    let sellCount = 0;
    let completeCount = 0;

    for (const date in trades) {
      for (const location in trades[date]) {
        for (const trade of trades[date][location]) {
          if (trade.buyer_id === userId) {
            purchaseCount++;
          } else if (trade.seller_id === userId) {
            sellCount++;
          }
          if (isPast(new Date(date))) {
            completeCount++;
          }
        }
      }
    }

    return { purchaseCount, sellCount, completeCount };
  };

  // 더미 거래 데이터 생성
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
    "2024-08-08": {
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
    "2024-08-09": {
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
    "2024-08-10": {},
    "2024-08-11": {
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
    "2024-08-12": {},
    "2024-08-13": {},
    "2024-08-14": {
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

  const { purchaseCount, sellCount, completeCount } = getWeekTrades(
    weeklyTrades,
    userId
  );
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
              <Typography className="trade-summary-text">
                {purchaseCount}
              </Typography>
            </Box>
            <Box className="trade-summary-item">
              <Sell className="trade-summary-icon" />
              <Typography className="trade-summary-text">
                {sellCount}
              </Typography>
            </Box>
            <Box className="trade-summary-item">
              <TradeDoneIcon className="trade-summary-icon" />
              <Typography className="trade-summary-text">
                {completeCount}
              </Typography>
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
          {generateWeekDates().map(({ date, isPast }) => {
            const tradeCount = getTradeCount(
              weeklyTrades[format(date, "yyyy-MM-dd")] || {}
            );
            return (
              <Box
                key={format(date, "yyyy-MM-dd")}
                className="trade-box"
                onClick={(event) => handleDateClick(event, date)}
              >
                <img
                  src={tradeCount === null ? Trade : isPast ? TradeDone : Trade}
                  alt="거래아이콘"
                />
                <Typography
                  className={
                    tradeCount === null
                      ? "trade-text"
                      : isPast
                      ? "trade-done-text"
                      : "trade-text"
                  }
                >
                  {tradeCount}
                </Typography>
              </Box>
            );
          })}
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

/*
전자 코드와 다른 부분:
jsx
코드 복사
import { ReactComponent as TradeIcon } from "../../../assets/images/trade.svg";

const [trades, setTrades] = useState({});

useEffect(() => {
  // 현재 주간 데이터 가져오기
  fetchWeeklyTrades();
}, [currentWeek]);

const fetchWeeklyTrades = async () => {
  const startOfWeekStr = format(startDate, "yyyy-MM-dd");
  const endOfWeekStr = format(addDays(startDate, 6), "yyyy-MM-dd");

  try {
    const response = await fetch(
      `/api/trades?start=${startOfWeekStr}&end=${endOfWeekStr}&userId=${userId}`
    );
    const data = await response.json();
    setTrades(data);
  } catch (error) {
    console.error("Failed to fetch weekly trades", error);
  }
};

const { purchaseCount, sellCount, completeCount } = getWeekTrades(
  trades,
  userId
);

<CalendarTrade
  userId={userId}
  selectedDate={selectedDate}
  trades={
    selectedDate
      ? trades[format(selectedDate, "yyyy-MM-dd")] || {}
      : {}
  }
/>
후자 코드와 다른 부분:
jsx
코드 복사
// import { ReactComponent as TradeIcon } from "../../../assets/images/trade.svg";

const [weeklyTrades, setWeeklyTrades] = useState({});

useEffect(() => {
  // 현재 주간 데이터 필터링
  filterWeeklyTrades();
}, [currentWeek]);

const filterWeeklyTrades = () => {
  const startOfWeekStr = format(startDate, "yyyy-MM-dd");
  const endOfWeekStr = format(addDays(startDate, 6), "yyyy-MM-dd");

  // 더미 데이터에서 현재 주간 데이터 필터링
  const filteredTrades = Object.keys(dummyTrades)
    .filter((date) => date >= startOfWeekStr && date <= endOfWeekStr)
    .reduce((obj, key) => {
      obj[key] = dummyTrades[key];
      return obj;
    }, {});

  setWeeklyTrades(filteredTrades);
};

const { purchaseCount, sellCount, completeCount } = getWeekTrades(
  weeklyTrades,
  userId
);

// 더미 거래 데이터 생성
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
  "2024-08-08": {
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
  "2024-08-09": {
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
  "2024-08-10": {},
  "2024-08-11": {
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
  "2024-08-12": {},
  "2024-08-13": {},
  "2024-08-14": {
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

<CalendarTrade
  userId={userId}
  selectedDate={selectedDate}
  trades={
    selectedDate
      ? dummyTrades[format(selectedDate, "yyyy-MM-dd")] || {}
      : {}
  }
/>
*/
