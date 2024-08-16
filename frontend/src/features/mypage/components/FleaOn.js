import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserRegionInput from "../../auth/components/UserRegionInput";
import { Box, Typography, Modal, Slide, Button } from "@mui/material";
import {
  ShoppingCartOutlined,
  Sell,
  BookmarkBorderOutlined,
  PinDropOutlined,
} from "@mui/icons-material";

const FleaOn = () => {
  const navigate = useNavigate();
  const [openRegionModal, setOpenRegionModal] = useState(false);

  const handleBuyListClick = () => {
    navigate("/mypage/buy-list");
  };

  const handleSellListClick = () => {
    navigate("/mypage/sell-list");
  };

  const handleScrapListClick = () => {
    navigate("/mypage/scrap-list");
  };

  const handleRegionClick = () => {
    setOpenRegionModal(true);
  };

  const handleCloseRegionModal = () => {
    setOpenRegionModal(false);
  };
  return (
    <Box
      sx={{
        pt: 2,
        px: 2.5,
        mb: 5,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <Box
        sx={{
          p: 1,
          width: "100%",
          borderBottom: "0.80px rgba(0, 0, 0, 0.20) solid",
          justifyContent: "flex-start",
          alignItems: "center",
          display: "flex",
        }}
      >
        <Typography sx={{ fontSize: 20 }} fontWeight={800} color="#2E2E32">
          나의 플리:온
        </Typography>
      </Box>

      <Box
        sx={{
          px: 1,
          py: 2,
          width: "100%",
          borderBottom: "0.50px rgba(0, 0, 0, 0.09) solid",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 1,
          display: "flex",
        }}
        onClick={handleBuyListClick}
      >
        <ShoppingCartOutlined />
        <Typography sx={{ fontSize: 20 }}>구매내역</Typography>
      </Box>

      <Box
        sx={{
          px: 1,
          py: 2,
          width: "100%",
          borderBottom: "0.50px rgba(0, 0, 0, 0.09) solid",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 1,
          display: "flex",
        }}
        onClick={handleSellListClick}
      >
        <Sell />
        <Typography sx={{ fontSize: 20 }}>판매내역</Typography>
      </Box>

      <Box
        sx={{
          px: 1,
          py: 2,
          width: "100%",
          borderBottom: "0.50px rgba(0, 0, 0, 0.09) solid",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 1,
          display: "flex",
        }}
        onClick={handleScrapListClick}
      >
        <BookmarkBorderOutlined />
        <Typography sx={{ fontSize: 20 }}>관심목록</Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          p: 1,

          borderBottom: "1px rgba(0, 0, 0, 0.20) solid",
          justifyContent: "flex-start",
          alignItems: "center",
          display: "flex",
        }}
      >
        <Typography sx={{ fontSize: 20 }} fontWeight={800}>
          기타
        </Typography>
      </Box>

      <Box
        sx={{
          pl: 1,
          py: 2,
          width: "100%",
          borderBottom: "0.50px rgba(0, 0, 0, 0.09) solid",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 1,
          display: "flex",
        }}
        onClick={handleRegionClick}
      >
        <PinDropOutlined />
        <Typography sx={{ fontSize: 20 }}>선호 지역 설정</Typography>
      </Box>

      {/* 모달 */}
      <Modal
        open={openRegionModal}
        onClose={handleCloseRegionModal}
        closeAfterTransition
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <Slide direction="up" in={openRegionModal} mountOnEnter unmountOnExit>
          <Box
            sx={{
              width: "100%",
              maxWidth: "500px",
              bgcolor: "background.paper",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              boxShadow: 24,
              px: 3,
              pb: 4,
            }}
          >
            <UserRegionInput />
            <Button
              sx={{
                bgcolor: "#FF0B55",
                mt: 2,
                width: "100%",
                color: "#ffffff",
                borderRadius: 2,
              }}
              onClick={handleCloseRegionModal}
            >
              변경하기
            </Button>
          </Box>
        </Slide>
      </Modal>
    </Box>
  );
};

export default FleaOn;
