import React, { useState, useEffect } from "react";
import { Modal, Box, Button, Typography, TextField } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import styles from '../styles/ChangeTime.module.css';
import { getTradeDetail, sendMessageDB } from "../features/chat/ChatApi";
import useDidMountEffect from "../utils/useDidMountEffect";
const ChangeTime = ({ open, handleClose, chatID }) => {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [currentTradeTime, setCurrentTradeTime] = useState(null);

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };

    // useEffect(() => {
    //   console.log(111)
    //     const fetchTradeDetail = async () => {
    //         try {
    //             const tradeDetail = await getTradeDetail(chatID).then((res)=>{
    //               console.log(res.tradeDate)
    //               const tradeDateTime = dayjs(`${res.TradeDate} ${res.TradeTime}`);
    //               setCurrentTradeTime(tradeDateTime);
    //             })
    //         } catch (error) {
    //             console.error("Error fetching trade detail:", error);
    //         }
    //     };

    //     if (chatID!=undefined) {
    //         fetchTradeDetail();
    //     }
    // }, [chatID]);
// useDidMountEffect(()=>{
//   getTradeDetail(chatID).then((res)=>{
//     console.log(res)
//     setCurrentTradeTime(dayjs(`${res.TradeDate} ${res.TradeTime}`));
//   })
// },[chatID]);
    const handleRequestChangeTime = async () => {
        const messageContent = `거래 시간 변경 요청: ${selectedDate.format('YYYY-MM-DD HH:mm')}`;
        try {
            await sendMessageDB(chatID, messageContent);
            handleClose(); // 모달 닫기
        } catch (error) {
            console.error("Error sending change time request:", error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            BackdropProps={{
                style: {
                    backgroundColor: "transparent",
                },
            }}
        >
            <div className={styles.modalOverlay}>
                <Box
                    className={styles.modalContent}
                    sx={{
                        backgroundColor: '#ffe5eb',
                        padding: '50px 20px 20px 20px',
                        borderRadius: '8px 8px 0 0',
                        width: '90%',
                        maxWidth: '500px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        position: 'relative',
                        height: '70%',
                        overflowY: 'auto',
                        animation: 'fadeIn 0.35s ease',
                        textAlign: 'center',
                    }}
                >
                    <div className={styles.modalHeader}>
                        <span className={styles.closeButton} onClick={handleClose}>&times;</span>
                    </div>
                    <Typography
                        gutterBottom
                        sx={{
                            fontSize: '25px',
                            fontWeight: 'bold',
                            marginBottom: '20px',
                            marginTop: '50px'
                        }}
                    >
                        거래 시간 변경 요청
                    </Typography>
                    <Typography
                        variant="body1"
                        gutterBottom
                        sx={{
                            fontSize: '14px',
                            marginBottom: '20px',
                            lineHeight: 1.5,
                        }}
                    >
                        현재 약속 시간<br/>
                        {currentTradeTime ? currentTradeTime.format('YYYY년 MM월 DD일 A hh시 mm분') : '로딩 중...'}
                    </Typography>
                    <Typography
                        variant="body2"
                        gutterBottom
                        sx={{
                            marginBottom: '20px',
                        }}
                    >
                        변경 희망 시간
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} fullWidth sx={{ marginBottom: '1px' }} />}
                        />
                    </LocalizationProvider>
                    <Typography
                        variant="body2"
                        gutterBottom
                        color="textSecondary"
                        sx={{
                            fontSize: '12px',
                            color: '#777',
                            marginBottom: '20px',
                            marginTop: '10px',
                            lineHeight: 1.5,
                        }}
                    >
                        상대방이 거절할 경우 거래가 취소될 수 있습니다.
                    </Typography>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: '#FF0B55',
                            fontWeight: 'bold',
                            borderRadius: '5px',
                            padding: '10px 0',
                            marginTop: '20px',
                            boxShadow: 'none',
                            width: '50%',
                            '&:hover': {
                                backgroundColor: '#FF0B55',
                                boxShadow: 'none',
                            },
                            '&:active': {
                                backgroundColor: '#FF0B55',
                                boxShadow: 'none',
                            },
                            '&:focus': {
                                backgroundColor: '#FF0B55',
                                boxShadow: 'none',
                            },
                        }}
                        onClick={handleRequestChangeTime} // 요청 버튼 클릭 시 함수 실행
                    >
                        요청하기
                    </Button>
                </Box>
            </div>
        </Modal>
    );
};

export default ChangeTime;
