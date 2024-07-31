import React, { useState } from "react";
import { format, addWeeks, subWeeks, startOfWeek, addDays } from "date-fns";
import "../../../styles/Calendar.css";

const Calendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const startDate = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Start week from Monday

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const renderDaysOfWeek = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      days.push(
        <div className="diary-day" key={i}>
          <div className="diary-day-dot-container">
            <div className="diary-day-dot"></div>
            <div className="diary-day-label">{format(day, "EEE")}</div>
            <div className="diary-day-number">{format(day, "dd")}</div>
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="Diary">
      <div className="diary-container">
        <div className="diary-week-control-container">
          <svg
            onClick={handlePreviousWeek}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-caret-left-fill"
            viewBox="0 0 16 16"
          >
            <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
          </svg>
          <span className="diary-week-control-text">WEEK</span>
          <svg
            onClick={handleNextWeek}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-caret-right-fill"
            viewBox="0 0 16 16"
          >
            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 1 0 0 1.506z" />
          </svg>
        </div>
        <div className="diary-week-info-container">
          <div className="diary-week-line"></div>
          {renderDaysOfWeek()}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
