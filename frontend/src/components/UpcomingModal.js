import React from "react";
import { Box, Typography, Modal, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const UpcomingModal = ({ open, handleClose, liveDate }) => (
  <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        예정된 방송
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        방송 날짜: {liveDate}
      </Typography>
      <Button onClick={handleClose} sx={{ mt: 2 }}>
        닫기
      </Button>
    </Box>
  </Modal>
);

export default UpcomingModal;
