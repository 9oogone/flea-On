import React from "react";
import { Box, Typography, Modal, List, ListItem, ListItemText, Button } from "@mui/material";
import styles from '../styles/UpcomingModal.module.css';

const UpcomingModal = ({ open, handleClose, liveDate, products }) => {
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
        <Box className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <Typography variant="h6" component="h2">
              {liveDate}
            </Typography>
            <span className={styles.closeButton} onClick={handleClose}>&times;</span>
          </div>
          <div className={styles.modalBody}>
            <List className={styles.productList}>
              {products.map((product, index) => (
                <ListItem key={index} className={styles.productItem}>
                  <ListItemText primary={product.name} secondary={product.price} />
                </ListItem>
              ))}
            </List>
          </div>
          <div className={styles.button}>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </Box>
      </div>
    </Modal>
  );
};

export default UpcomingModal;
