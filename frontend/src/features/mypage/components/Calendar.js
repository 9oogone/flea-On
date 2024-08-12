import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchCalendarWeek, fetchCalendarDate } from "../actions";
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
import { ReactComponent as TradeDoneIcon } from "../../../assets/images/trade_done.svg";
import "../../../styles/Calendar.css";

const Calendar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userId = useSelector((state) => state.auth.user.userId);
  const weekTradeInfo = useSelector((state) => state.calendar.week.tradeInfo);
  const weekTradeList = useSelector((state) => state.calendar.week.tradeList);
  const dateTrade = useSelector((state) => state.calendar.date.data);

  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const [startDate, setStartDate] = useState(
    startOfWeek(currentWeek, { weekStartsOn: 0 })
  );
  const [startDateStr, setStartDateStr] = useState(
    format(startDate, "yyyy-MM-dd")
  );

  useEffect(() => {
    const newStartDate = startOfWeek(currentWeek, { weekStartsOn: 0 });
    setStartDate(newStartDate);
    setStartDateStr(format(newStartDate, "yyyy-MM-dd"));
  }, [currentWeek]);

  //주간 날짜 배열 생성
  const generateWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      dates.push({
        index: i,
        realDay: day,
        date: format(day, "yyyy-MM-dd"),
        day: format(day, "d"),
        isToday: isToday(day),
        isPast: isPast(day),
      });
    }
    return dates;
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
    setSelectedDate(null);
    dispatch(fetchCalendarWeek({ email: user.email, today: startDateStr }));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
    setSelectedDate(null);
    dispatch(fetchCalendarWeek({ email: user.email, today: startDateStr }));
    console.log(dateTrade);
  };

  const handleDateClick = async (event, date) => {
    event.preventDefault();
    setSelectedDate(date);
    dispatch(fetchCalendarDate({ email: user.email, tradeDate: date }));
  };

  const dates = generateWeekDates();
  // console.log(weekTradeInfo);
  // console.log(weekTradeList);
  useEffect(() => {
    if (startDateStr !== undefined) {
      dispatch(fetchCalendarWeek({ email: user.email, today: startDateStr }));
    }
  }, [startDateStr]);

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
                {weekTradeInfo.purchaseCount}
              </Typography>
            </Box>
            <Box className="trade-summary-item">
              <Sell className="trade-summary-icon" />
              <Typography className="trade-summary-text">
                {weekTradeInfo.saleCount}
              </Typography>
            </Box>
            <Box className="trade-summary-item">
              <TradeDoneIcon className="trade-summary-icon" />
              <Typography className="trade-summary-text">
                {weekTradeInfo.completedTrades}
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
          {dates.map(({ date, index }) => {
            const tradeCount = weekTradeList[index];
            return (
              <Box
                key={date}
                className="trade-box"
                onClick={(event) => handleDateClick(event, date)}
              >
                <img
                  src={
                    tradeCount?.totalTrades === 0 &&
                    tradeCount?.completedTrades !== 0
                      ? TradeDone
                      : Trade
                  }
                  alt="거래아이콘"
                />
                <Typography
                  className={
                    tradeCount?.totalTrades === 0 &&
                    tradeCount?.completedTrades !== 0
                      ? "trade-done-text"
                      : "trade-text"
                  }
                >
                  {tradeCount?.totalTrades !== 0
                    ? tradeCount?.totalTrades
                    : null}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Box className="calendar-footer">
          {dates.map(({ date, day, isToday }) => {
            const isSelected = selectedDate === date;
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
        dateTrade={dateTrade}
      />
    </Box>
  );
};

//   const dateTrade = useSelector((state) => state.calendar.date.data);

//   const handlePreviousWeek = () => {
//     setCurrentWeek(subWeeks(currentWeek, 1));
//     setSelectedDate(null);
//   };

//   const handleNextWeek = () => {
//     setCurrentWeek(addWeeks(currentWeek, 1));
//     setSelectedDate(null);
//   };

//   const handleDateClick = async (event, date) => {
//     event.preventDefault();
//     setSelectedDate(date);
//   };

//   // 주간 날짜 배열 생성
//   const generateWeekDates = () => {
//     const dates = [];
//     for (let i = 0; i < 7; i++) {
//       const day = addDays(startDate, i);
//       dates.push({
//         index: i,
//         realDay: day,
//         date: format(day, "yyyy-MM-dd"),
//         day: format(day, "d"),
//         isToday: isToday(day),
//         isPast: isPast(day),
//       });
//     }
//     return dates;
//   };

//   const dates = generateWeekDates();
//   console.log(user.email, startDateStr);
//   useDidMountEffect(() => {
//     console.log(user.email, startDateStr);
//     dispatch(fetchCalendarWeek({ email: user.email, today: startDateStr }));
//     console.log(weekTradeInfo);
//   }, [dispatch, user.email, startDateStr]);
//   console.log("111");
//   console.log(weekTradeInfo);
//   console.log(weekTradeList);

//   return (
//     <Box className="calendar-container">
//       <Box className="calendar-header">
//         <Box className="calendar-header-top">
//           <Box className="trade-summary">
//             <Typography variant="h6" className="month-text">
//               {format(currentWeek, "M월")}
//             </Typography>
//             <Box className="trade-summary-item">
//               <ShoppingCart className="trade-summary-icon" />
//               <Typography className="trade-summary-text">
//                 {weekTradeInfo.purchaseCount}
//               </Typography>
//             </Box>
//             <Box className="trade-summary-item">
//               <Sell className="trade-summary-icon" />
//               <Typography className="trade-summary-text">
//                 {weekTradeInfo.saleCount}
//               </Typography>
//             </Box>
//             <Box className="trade-summary-item">
//               <TradeDoneIcon className="trade-summary-icon" />
//               <Typography className="trade-summary-text">
//                 {weekTradeInfo.CompletedTrades}
//               </Typography>
//             </Box>
//           </Box>
//           <Box className="navigation-buttons">
//             <IconButton onClick={handlePreviousWeek}>
//               <NavigateBefore />
//             </IconButton>
//             <IconButton onClick={handleNextWeek}>
//               <NavigateNext />
//             </IconButton>
//           </Box>
//         </Box>
//         <Box className="calendar-weekdays">
//           {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
//             <Box key={day} className="weekday-text">
//               <Typography className="footer-date-text">{day}</Typography>
//             </Box>
//           ))}
//         </Box>
//         <Box className="calendar-trade">
//           {dates.map(({ date, index }) => {
//             const tradeCount = weekTradeList[index];
//             return (
//               <Box
//                 key={date}
//                 className="trade-box"
//                 onClick={(event) => handleDateClick(event, date)}
//               >
//                 <img
//                   src={
//                     tradeCount.totalTrades === tradeCount.completedTrades
//                       ? TradeDone
//                       : Trade
//                   }
//                   alt="거래아이콘"
//                 />
//                 <Typography
//                   className={
//                     tradeCount.totalTrades === tradeCount.completedTrades
//                       ? "trade-done-text"
//                       : "trade-text"
//                   }
//                 >
//                   {tradeCount.totalTrades}
//                 </Typography>
//               </Box>
//             );
//           })}
//         </Box>
//         //{" "}
//         <Box className="calendar-footer">
//           //{" "}
//           {dates.map(({ date, day, isToday }) => {
//             const isSelected = selectedDate === date;
//             return (
//               <Box key={day} className="footer-date-box">
//                 <Box
//                   className={`footer-date-icon ${
//                     isToday && !isSelected
//                       ? "footer-date-icon-active-today"
//                       : isSelected
//                       ? "footer-date-icon-active-selected"
//                       : ""
//                   }`}
//                 >
//                   <Typography
//                     className={`footer-date-text ${
//                       isToday && !isSelected
//                         ? "footer-date-text-active-today"
//                         : isSelected
//                         ? "footer-date-text-active-selected"
//                         : ""
//                     }`}
//                   >
//                     {day}
//                   </Typography>
//                 </Box>
//               </Box>
//             );
//           })}
//         </Box>
//       </Box>
//       {/* 일별 거래내역 */}
//       <CalendarTrade
//         userId={userId}
//         selectedDate={selectedDate}
//         trades={dateTrade}
//       />
//     </Box>
//   );
// };

export default Calendar;
