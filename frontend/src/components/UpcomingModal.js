import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleScrap } from "../features/mypage/scrapSlice";
import { Box, Typography, Modal, List, ListItem } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import styles from "../styles/UpcomingModal.module.css";

const UpcomingModal = ({
  id,
  open,
  handleClose,
  liveDate,
  productNames = [],
  productPrices = [],
  title,
  thumbnail,
  author,
  tradePlace,
}) => {
  const dispatch = useDispatch();
  const isScrap = useSelector((state) =>
    Array.isArray(state.scrap.live)
      ? state.scrap.live.find((item) => item.id === id)?.is_scrap
      : false
  );
  const handleScrapToggle = () => {
    dispatch(toggleScrap({ id }));
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
        <Box className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <img
              src={thumbnail}
              alt="thumbnail"
              className={styles.thumbnailImage}
            />
            <div className={styles.textContainer}>
              <Typography variant="h6" component="h2" className={styles.title}>
                <span className={styles.titleText}>{title}</span>
                <Box onClick={handleScrapToggle}>
                  {isScrap ? (
                    <BookmarkIcon className={styles.bookmarkIcon} />
                  ) : (
                    <BookmarkBorderIcon className={styles.bookmarkIcon} />
                  )}
                </Box>
              </Typography>
              <Typography
                variant="body2"
                component="p"
                className={styles.author}
              >
                {author}
              </Typography>
              <Typography
                variant="body2"
                component="p"
                className={styles.liveDate}
              >
                방송 시간 {liveDate}
              </Typography>
            </div>
            <span className={styles.closeButton} onClick={handleClose}>
              &times;
            </span>
          </div>
          <div className={styles.modalHeader2}>
            <div className={styles.textContainer}>
              <Typography
                variant="body2"
                component="p"
                className={styles.tradePlace}
              >
                <div className={styles.tradeplacetext}>거래 장소</div>
                <div>{tradePlace}</div>
              </Typography>
            </div>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.listtitle}>판매 상품 목록</div>
            <List className={styles.productList}>
              {productNames.map((product, index) => (
                <ListItem key={index} className={styles.productItem}>
                  <div className={styles.productName}>{product}</div>
                  <div
                    className={styles.productPrice}
                  >{`${productPrices[index]}원`}</div>
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
