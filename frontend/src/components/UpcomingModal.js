import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Modal,
  List,
  ListItem,
  IconButton,
  Button,
  Badge,
  SmallAvatar,
  Avatar,
} from "@mui/material";
// import levelBaby from "../assets/images/level_baby.svg";
// import levelSmall from "../assets/images/level_small.svg";
// import levelMiddle from "../../../assets/images/level_middle.svg";
// import levelBig from "../../../assets/images/level_big.svg";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import styles from "../styles/UpcomingModal.module.css";
import { formatDateTime, formatPrice, formatLevel } from "../utils/cssUtils";

const UpcomingModal = ({
  id,
  open,
  handleClose,
  liveDetail,
  setScrap,
  scrap,
}) => {
  const auth = useSelector((state) => state.auth.user?.userId);
  const user = useSelector((state) => state.live.liveDetail?.user?.userId);
  // console.log(user, "사용자입니다");
  // console.log(auth, "판매자입니다.");
  // console.log(liveDetail);
  const handleEditLive = () => {
    // navigate(`/edit-live/${liveDetail.liveId}`, { state: { liveDetail } });
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
              src={liveDetail?.liveThumbnail}
              alt="thumbnail"
              className={styles.thumbnailImage}
            />
            <div className={styles.textContainer}>
              <Typography variant="h6" component="h2" className={styles.title}>
                <span className={styles.titleText}>{liveDetail?.title}</span>
                <IconButton
                  onClick={() => {
                    setScrap();
                  }}
                >
                  {scrap ? (
                    <BookmarkIcon className={styles.bookmarkIcon} />
                  ) : (
                    <BookmarkBorderIcon className={styles.bookmarkIcon} />
                  )}
                </IconButton>
              </Typography>
              {/* <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  // <SmallAvatar
                  // alt={formatLevel(liveDetail?.user.level).name}
                  // src={formatLevel(liveDetail?.user.level).icon}
              //     />
              //   }
              // >
                <Avatar
                  alt={liveDetail?.user.nickname}
                  src={liveDetail?.user.profilePicture}
                />
              </Badge> */}
              <Typography
                variant="body2"
                component="p"
                className={styles.author}
              >
                {liveDetail?.user?.nickname}
              </Typography>
              <Typography
                variant="body2"
                component="p"
                className={styles.liveDate}
              >
                방송 시간 {formatDateTime(liveDetail?.liveDate)}
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
                <div>{liveDetail?.tradePlace}</div>
              </Typography>
            </div>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.listtitle}>판매 상품 목록</div>
            <List className={styles.productList}>
              {liveDetail?.products?.map((product, index) => (
                <ListItem key={index} className={styles.productItem}>
                  <div className={styles.productName}>{product.name}</div>
                  <div className={styles.productPrice}>
                    {formatPrice(product.price)}
                  </div>
                </ListItem>
              ))}
            </List>
          </div>

          {auth && auth === user && (
            <Box
              sx={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                mt: 10,
              }}
            >
              <Button
                variant="contained"
                onClick={handleEditLive}
                sx={{
                  width: "95%",
                  backgroundColor: "#FF0B55",
                  color: "white",
                  fontSize: 16,
                  borderRadius: 2,
                }}
              >
                라이브 수정하기
              </Button>
            </Box>
          )}
        </Box>
      </div>
    </Modal>
  );
};

export default UpcomingModal;
