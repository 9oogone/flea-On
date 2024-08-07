import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';


const CancelTrade = ({ isOpen, onClose }) => {
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
        <Button onClick={onClose} color="primary" autoFocus>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelTrade;
