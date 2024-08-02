import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import koLocale from 'date-fns/locale/ko';
import { setDate } from './dateSlice'; // 리덕스 슬라이스에서 액션 임포트
import styles from './DateSelect.module.css';

const DateSelect = ({ className = "" }) => {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state) => state.date.selectedDate);

  const handleDateChange = (newValue) => {
    dispatch(setDate(newValue));
  };

  return (
    <div className={[styles.dateSelect, className].join(' ')}>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={koLocale}>
        <DatePicker
          label="날짜 선택"
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      {selectedDate && (
        <div className={styles.selectedDate}>
          {new Date(selectedDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      )}
    </div>
  );
};

export default DateSelect;
