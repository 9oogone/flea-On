import React, { useState } from 'react';
import styles from '../styles/SellerForm.module.css';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker, DatePicker, DesktopDateTimePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

dayjs.locale('ko');

const SellerformSelect = ({ onClose }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [startDate, setStartDate] = useState(dayjs());
  const [transactionTimes, setTransactionTimes] = useState([{ date: dayjs(), from: dayjs(), to: dayjs() }]);

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleAddTransactionTime = () => {
    setTransactionTimes([...transactionTimes, { date: dayjs(), from: dayjs(), to: dayjs() }]);
  };

  const handleTransactionTimeChange = (index, field, value) => {
    const updatedTimes = transactionTimes.map((time, idx) => (
      idx === index ? { ...time, [field]: value } : time
    ));
    setTransactionTimes(updatedTimes);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('thumbnail', thumbnail);

    try {
      const response = await fetch('/api/upload-thumbnail', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <span className={styles.closeButton} onClick={onClose}>&times;</span>
        <form onSubmit={handleSubmit} className={styles.sellerformcontainer}>
          <div className={styles.input}>
            <label className={styles.label}></label>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <TextField
                id="outlined-basic"
                label="라이브 방송 제목"
                size="medium"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: '10px', marginTop: '10px' }}
              />
              <div className='livestarttime' style={{ marginBottom: '10px' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                  <DemoContainer components={['DesktopDateTimePicker']}>
                    <DesktopDateTimePicker
                      label="라이브 방송 시간"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      ampm={true}
                      disablePast={true}
                      slotProps={{
                        popper: {
                          sx: {
                            '& .MuiDateCalendar-root': {
                              overflow: 'hidden',
                              width: '250px',
                              maxHeight: '336px',
                              display: 'flex',
                              flexDirection: 'column',
                              margin: '0 auto',
                              height: '336px',
                            },
                          },
                        },
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
            <div className={styles.thumbnailContainer}>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className={styles.thumbnailInput}
                style={{ display: 'none' }}
                id="thumbnail-upload"
              />
              <label htmlFor="thumbnail-upload" style={{ cursor: 'pointer' }}>
                {thumbnailPreview ? (
                  <img
                    className={styles.thumbnailPreview}
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                  />
                ) : (
                  <div className={styles.noThumbnail}>
                    <AddToPhotosIcon sx={{ color: "gray" }} />
                  </div>
                )}
              </label>
              {thumbnailPreview && (
                <IconButton onClick={() => {
                  setThumbnail(null);
                  setThumbnailPreview(null);
                }}>
                  <CloseIcon />
                </IconButton>
              )}
            </div>
          </div>
          <div className={styles.sellerTimeContainer}>
            <div className={styles.sellerTime}>
              <div className={styles.div1}>거래 가능 시간</div>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                {transactionTimes.map((time, index) => (
                  <div key={index} className={styles.dateParent} style={{ marginBottom: '20px' }}>
                    <div>
                      <DatePicker
                        label="날짜"
                        value={time.date}
                        onChange={(newValue) => handleTransactionTimeChange(index, 'date', newValue)}
                        renderInput={(params) => <TextField {...params} />}
                        inputFormat="YYYY년 MM월 DD일"
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <DemoItem>
                        <TimePicker
                          label="부터"
                          value={time.from}
                          onChange={(newValue) => handleTransactionTimeChange(index, 'from', newValue)}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </DemoItem>
                      <span style={{ margin: '0 10px' }}>~</span>
                      <DemoItem>
                        <TimePicker
                          label="까지"
                          value={time.to}
                          onChange={(newValue) => handleTransactionTimeChange(index, 'to', newValue)}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </DemoItem>
                    </div>
                  </div>
                ))}
              </LocalizationProvider>
            </div>
          </div>
          <div className={styles.button}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTransactionTime}
              startIcon={<AddIcon />}
              style={{ marginBottom: '10px' }}
            >
              거래 가능 시간 추가
            </Button>
          </div>
          <div className={styles.button}>
            <button type="submit" className={styles.button1}>등록하기</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerformSelect;
