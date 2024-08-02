import React, { useState } from 'react';
import styles from '../styles/SellerForm.module.css';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, DesktopDateTimePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

// 로케일을 한국어로 설정
dayjs.locale('ko');

const SellerformSelect = ({ onClose }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('thumbnail', thumbnail);

    // 백엔드로 폼 데이터 전송
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
                  <TextField
                    id="outlined-basic"
                    label="라이브 방송 제목"
                    size="medium"
                    variant="outlined"
                    fullWidth
                    sx={{ width: "100%", marginBottom: "10px", marginTop: "10px" }} // 스타일을 적용하여 가로 사이즈를 설정
                  />
                <div className='livestarttime' style={{ width: '100%' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                    <DemoContainer components={['DesktopDateTimePicker']}>
                      <DesktopDateTimePicker
                        label="라이브 방송 시간"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth sx={{ width: '100%' }} />} // 스타일을 적용하여 가로 사이즈를 설정
                        ampm={true}  // 24시간 형식
                        disablePast={true}  // 과거 날짜 선택 비활성화
                        slotProps={{ // 달력 사이즈 조절하여 시간 선택 부분이 잘리지 않도록 조정
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
                <div className={styles.thumbnailContainer}>
                  <div>썸네일 설정</div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleThumbnailChange} 
                    className={styles.thumbnailInput}
                  />
                  {thumbnailPreview && (
                    <img 
                      className={styles.thumbnailPreview} 
                      src={thumbnailPreview} 
                      alt="Thumbnail Preview" 
                    />
                  )}
                </div>
            <div className={styles.sellerTime}>
              <div className={styles.div1}>거래 가능 시간</div>
              <div></div>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                <div className={styles.dateParent}>
                  <DatePicker
                    label="시작 날짜"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                    inputFormat="YYYY년 MM월 DD일"
                  />
                  <DatePicker
                    label="종료 날짜"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                    inputFormat="YYYY년 MM월 DD일"
                  />
                </div>
              </LocalizationProvider>
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
