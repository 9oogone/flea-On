import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";
import baseAxios from "../utils/httpCommons";
import Spinner from "../components/Spinner.js";

const CancelTrade = ({ isOpen, onClose, chatID, products }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const baseURL = baseAxios();
  async function cancelTrade() {
    try {
      setLoading(true);
      await baseURL.delete("fleaon/purchase/break-trade/" + chatID);
      await baseURL.post("/push/cancelAlarm", { productIds: products });
      setLoading(false);
      navigate("/chat", { replace: true });
      onClose();
    } catch (error) {
      console.error("Error cancelling trade:", error);
      throw error;
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={{ "& .MuiDialog-paper": { borderRadius: "16px" } }}
    >
      <DialogTitle
        sx={{
          color: "#FF0B55",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        거래 파기
      </DialogTitle>
      <DialogContent
        sx={{
          textAlign: "center",
        }}
      >
        <Typography variant="body1" sx={{ mb: 1.5 }}>
          거래를 파기하시겠습니까?
        </Typography>
        <Typography variant="body2" sx={{ color: "#888888" }}>
          (거래 파기 시 생성된 채팅방이 즉시 삭제됩니다.)
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          mb: 1,
          justifyContent: "center",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#ccc",
            color: "#333",
            width: "100px",
            borderRadius: "8px",
            margin: "0 8px",
          }}
        >
          취소
        </Button>
        <Button
          onClick={cancelTrade}
          variant="contained"
          color="primary"
          sx={{
            width: "100px",
            backgroundColor: "#FF0B55",
            color: "white",
            boxShadow: "none",
            borderRadius: "8px",
            margin: "0 8px",
          }}
        >
          거래 파기
        </Button>
      </DialogActions>
      {loading ? (
        <div>
          <Spinner />
        </div>
      ) : null}
    </Dialog>
  );
};

export default CancelTrade;
