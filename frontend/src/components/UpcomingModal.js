import React from "react";
import { Box, Typography, Modal, List, ListItem, ListItemText,Button } from "@mui/material";

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

const UpcomingModal = ({ open, handleClose, liveDate, products }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          {liveDate}
        </Typography>
        <List>
          {products.map((product, index) => (
            <ListItem key={index}>
              <ListItemText primary={product.name} secondary={product.price} />
            </ListItem>
          ))}
        </List>
        <Button onClick={handleClose}>Close</Button>
      </Box>
    </Modal>
  );
};

export default UpcomingModal;
