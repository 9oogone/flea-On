import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import baseAxios from '../utils/httpCommons';
import Spinner from "../components/Spinner.js"


const CancelTrade = ({ isOpen, onClose, chatID }) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const baseURL = baseAxios();
  async function cancelTrade() {
    try {
        setLoading(true)
        const response=await baseURL.delete("fleaon/purchase/break-trade/"+chatID)
        await baseURL.post('/push/cancelAlarm',{
          "nextId": response.data,
          "liveId": 0,
          "productId": 0
        })
        setLoading(false)
        navigate("/chat",{replace:true})
        onClose();
    } catch (error) {
        console.error("Error cancelling trade:", error);
        throw error;
    }
}

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="cancel-trade-dialog-title">
      <DialogTitle id="cancel-trade-dialog-title">거래 파기</DialogTitle>
      <DialogContent>
        <DialogContentText>
          거래를 파기하시겠습니까?
        </DialogContentText>
        <DialogContentText>
          파기된 거래는 재개할 수 없습니다.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          취소
        </Button>
        <Button onClick={cancelTrade} color="primary" autoFocus>
          확인
        </Button>
      </DialogActions>
      {loading?(
        <div>
        <Spinner/>
      </div>
        ):(null)}
    </Dialog>
  );
};

export default CancelTrade;
