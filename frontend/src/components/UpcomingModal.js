import React from "react";
import { Box, Typography, Modal, List, ListItem } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import styles from '../styles/UpcomingModal.module.css';

const UpcomingModal = ({ open, handleClose, liveDate, products, title, thumbnail, author, tradePlace, isScrap }) => {
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
            <img src={thumbnail} alt="thumbnail" className={styles.thumbnailImage} />
            <div className={styles.textContainer}>
            <Typography variant="h6" component="h2" className={styles.title}>
              <span className={styles.titleText}>{title}</span>
              {isScrap ? <BookmarkIcon className={styles.bookmarkIcon} /> : <BookmarkBorderIcon className={styles.bookmarkIcon} />}
            </Typography>
              <Typography variant="body2" component="p" className={styles.author}>
                {author}
              </Typography>
              <Typography variant="body2" component="p" className={styles.liveDate}>
                방송 시간 {liveDate}
              </Typography>
            </div>
            <span className={styles.closeButton} onClick={handleClose}>&times;</span>
          </div>
          <div className={styles.modalHeader2}>
            <div className={styles.textContainer}>
                <Typography variant="body2" component="p" className={styles.tradePlace}>
                    <div className={styles.tradeplacetext}>거래 장소</div>
                    <div>{tradePlace}</div>
                </Typography>
            </div>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.listtitle}>판매 상품 목록</div>
            <List className={styles.productList}>
              {products.map((product, index) => (
                <ListItem key={index} className={styles.productItem}>
                  <div className={styles.productName}>{product.name}</div>
                  <div className={styles.productPrice}>{`${product.price}원`}</div>
                </ListItem>
              ))}
            </List>
          </div>
        </Box>
      </div>
    </Modal>
  );
};

export default UpcomingModal;
