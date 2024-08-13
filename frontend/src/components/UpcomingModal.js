import React from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Modal,
  List,
  ListItem,
  IconButton,
  Button,
  Avatar,
} from "@mui/material";

import { ReactComponent as LevelBaby } from "../assets/images/level_baby.svg";
import { ReactComponent as LevelSmall } from "../assets/images/level_small.svg";
import { ReactComponent as LevelMiddle } from "../assets/images/level_middle.svg";
import { ReactComponent as LevelBig } from "../assets/images/level_big.svg";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import styles from "../styles/UpcomingModal.module.css";
import { formatDateTime, formatPrice } from "../utils/cssUtils";

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
  if (!liveDetail || !liveDetail.user) {
    return <div></div>;
  }
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
          <Box className={styles.thumbnailContainer}>
            <img
              src={liveDetail?.liveThumbnail}
              alt="thumbnail"
              className={styles.thumbnailImage}
            />
            <div className={styles.titleOverlay}>
              <Box
                sx={{
                  gap: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {liveDetail?.title}
                {liveDetail?.user.level < 2 ? (
                  <LevelBaby />
                ) : liveDetail?.user.level < 7 ? (
                  <LevelSmall />
                ) : liveDetail?.user.level < 26 ? (
                  <LevelMiddle />
                ) : (
                  <LevelBig />
                )}
              </Box>
            </div>
            <span className={styles.closeButton} onClick={handleClose}>
              <CloseRoundedIcon sx={{ color: "white" }} />
            </span>
          </Box>
          <Box sx={{ p: 3 }}>
            <div className={styles.modalHeader}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Avatar
                  alt={liveDetail?.user.nickname}
                  src={liveDetail?.user.profilePicture}
                />

                <Typography className={styles.author}>
                  {liveDetail?.user?.nickname}
                </Typography>
              </Box>

              <Button
                onClick={() => {
                  setScrap();
                }}
                sx={{
                  bgcolor: scrap ? "#EEEEEF" : "#FF0B55",
                  color: scrap ? "rgba(0, 0, 0, 0.52)" : "#FFFFFF",
                }}
              >
                {scrap ? (
                  <Typography>이미 찜한 라이브</Typography>
                ) : (
                  <Typography>라이브 찜하기</Typography>
                )}
              </Button>
            </div>

            <div className={styles.modalHeader2}>
              <div className={styles.textContainer}>
                <div className={styles.liveDate}>방송 시간</div>
                <div>{formatDateTime(liveDetail?.liveDate)}</div>
                <Typography className={styles.tradePlace}>
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
        </Box>
      </div>
    </Modal>
  );
};

export default UpcomingModal;
