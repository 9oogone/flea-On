import React from "react";
import { Box, Typography } from "@mui/material";
import {
  ShoppingCartOutlined,
  Sell,
  BookmarkBorderOutlined,
  PinDropOutlined,
} from "@mui/icons-material";

const FleaOn = () => {
  return (
    <Box
      sx={{
        p: 1,
        mb: 5,
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 2,
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
        <Typography variant="h5" fontWeight={800} color="#303030">
          나의 플리:온
        </Typography>
      </Box>

      <Box
        sx={{
          pl: 1,
          pb: 1,
          width: "100%",
          borderBottom: "0.50px rgba(0, 0, 0, 0.09) solid",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 1,
          display: "flex",
        }}
      >
        <ShoppingCartOutlined />
        <Typography variant="h5" fontWeight={400} color="#303030">
          구매내역
        </Typography>
      </Box>

      <Box
        sx={{
          pl: 1,
          pb: 1,
          width: "100%",
          borderBottom: "0.50px rgba(0, 0, 0, 0.09) solid",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 1,
          display: "flex",
        }}
      >
        <Sell />
        <Typography variant="h5" fontWeight={400} color="black">
          판매내역
        </Typography>
      </Box>

      <Box
        sx={{
          pl: 1,
          pb: 1,
          width: "100%",
          borderBottom: "0.50px rgba(0, 0, 0, 0.09) solid",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 1,
          display: "flex",
        }}
      >
        <BookmarkBorderOutlined />
        <Typography variant="h5" fontWeight={400} color="black">
          관심목록
        </Typography>
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
        <Typography variant="h5" fontWeight={800} color="black">
          기타
        </Typography>
      </Box>

      <Box
        sx={{
          pl: 1,
          pb: 1,
          width: "100%",
          borderBottom: "0.50px rgba(0, 0, 0, 0.09) solid",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 1,
          display: "flex",
        }}
      >
        <PinDropOutlined />
        <Typography variant="h5" fontWeight={400} color="black">
          선호 지역 설정
        </Typography>
      </Box>
    </Box>
  );
};

export default FleaOn;
