import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  ArrowBackIosNew,
  AccessTime,
  PlaceOutlined,
  ShopOutlined,
} from "@mui/icons-material";

const ChatTradeDetail = ({ isOpen, onClose }) => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "마리아상",
      price: "6만원",
      status: "상품취소",
      statusColor: "#FF0B55",
    },
    {
      id: 1,
      name: "마리아상",
      price: "6만원",
      status: "상품취소",
      statusColor: "#FF0B55",
    },
    {
      id: 1,
      name: "마리아상",
      price: "6만원",
      status: "상품취소",
      statusColor: "#FF0B55",
    },
    {
      id: 1,
      name: "마리아상",
      price: "6만원",
      status: "상품취소",
      statusColor: "#FF0B55",
    },
    {
      id: 1,
      name: "마리아상",
      price: "6만원",
      status: "상품취소",
      statusColor: "#FF0B55",
    },
    {
      id: 1,
      name: "마리아상",
      price: "6만원",
      status: "상품취소",
      statusColor: "#FF0B55",
    },
    {
      id: 1,
      name: "마리아상",
      price: "6만원",
      status: "상품취소",
      statusColor: "#FF0B55",
    },
    {
      id: 1,
      name: "마리아상",
      price: "6만원",
      status: "상품취소",
      statusColor: "#FF0B55",
    },
    {
      id: 1,
      name: "마리아상",
      price: "6만원",
      status: "상품취소",
      statusColor: "#FF0B55",
    },
    {
      id: 1,
      name: "마리아상",
      price: "6만원",
      status: "상품취소",
      statusColor: "#FF0B55",
    },
    {
      id: 2,
      name: "마리아상",
      price: "6만원",
      status: "상품추가",
      statusColor: "#FF0B55",
    },
    {
      id: 3,
      name: "마리아상",
      price: "6만원",
      status: "줄 서기",
      statusColor: "#FF5757",
    },
    {
      id: 4,
      name: "마리아상",
      price: "6만원",
      status: "줄 취소",
      statusColor: "#FF5757",
    },
    {
      id: 5,
      name: "마리아상",
      price: "6만원",
      status: "출 마감",
      statusColor: "#CCCCCC",
    },
    {
      id: 3,
      name: "마리아상",
      price: "6만원",
      status: "줄 서기",
      statusColor: "#FF5757",
    },
    {
      id: 4,
      name: "마리아상",
      price: "6만원",
      status: "줄 취소",
      statusColor: "#FF5757",
    },
    {
      id: 5,
      name: "마리아상",
      price: "6만원",
      status: "출 마감",
      statusColor: "#CCCCCC",
    },
    {
      id: 3,
      name: "마리아상",
      price: "6만원",
      status: "줄 서기",
      statusColor: "#FF5757",
    },
    {
      id: 4,
      name: "마리아상",
      price: "6만원",
      status: "줄 취소",
      statusColor: "#FF5757",
    },
    {
      id: 5,
      name: "마리아상",
      price: "6만원",
      status: "출 마감",
      statusColor: "#CCCCCC",
    },
    {
      id: 3,
      name: "마리아상",
      price: "6만원",
      status: "줄 서기",
      statusColor: "#FF5757",
    },
    {
      id: 4,
      name: "마리아상",
      price: "6만원",
      status: "줄 취소",
      statusColor: "#FF5757",
    },
    {
      id: 5,
      name: "마리아상",
      price: "6만원",
      status: "출 마감",
      statusColor: "#CCCCCC",
    },
    {
      id: 3,
      name: "마리아상",
      price: "6만원",
      status: "줄 서기",
      statusColor: "#FF5757",
    },
    {
      id: 4,
      name: "마리아상",
      price: "6만원",
      status: "줄 취소",
      statusColor: "#FF5757",
    },
    {
      id: 5,
      name: "마리아상",
      price: "6만원",
      status: "출 마감",
      statusColor: "#CCCCCC",
    },
    {
      id: 3,
      name: "마리아상",
      price: "6만원",
      status: "줄 서기",
      statusColor: "#FF5757",
    },
    {
      id: 4,
      name: "마리아상",
      price: "6만원",
      status: "줄 취소",
      statusColor: "#FF5757",
    },
    {
      id: 5,
      name: "마리아상",
      price: "6만원",
      status: "출 마감",
      statusColor: "#CCCCCC",
    },
    {
      id: 3,
      name: "마리아상",
      price: "6만원",
      status: "줄 서기",
      statusColor: "#FF5757",
    },
    {
      id: 4,
      name: "마리아상",
      price: "6만원",
      status: "줄 취소",
      statusColor: "#FF5757",
    },
    {
      id: 5,
      name: "마리아상",
      price: "6만원",
      status: "출 마감",
      statusColor: "#CCCCCC",
    },
  ]);

  if (!isOpen) return null;

  const handleBackButtonClick = () => {
    onClose(true);
  };

  const handleStatusClick = (id) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              status:
                product.status === "상품취소"
                  ? "상품추가"
                  : product.status === "상품추가"
                  ? "상품취소"
                  : product.status === "줄 서기"
                  ? "줄 취소"
                  : product.status === "줄 취소"
                  ? "줄 서기"
                  : product.status,
              statusColor:
                product.status === "상품취소"
                  ? "#FF0B55"
                  : product.status === "상품추가"
                  ? "#FF0B55"
                  : product.status === "줄 서기"
                  ? "#FF5757"
                  : product.status === "줄 취소"
                  ? "#FF5757"
                  : "#CCCCCC",
            }
          : product
      )
    );
  };

  const ProductItem = ({ product, onStatusClick }) => {
    return (
      <Box
        sx={{
          display: "flex",
          gap: 1,
          p: 1,
        }}
      >
        <Typography
          sx={{
            width: "45%",
            display: "flex",
            alignItems: "center",
            fontSize: 18,
          }}
        >
          {product.name}
        </Typography>
        <Typography
          sx={{
            width: "18%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            pr: 1,
          }}
        >
          {product.price}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ShopOutlined sx={{ fontSize: 28 }} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <Box
            onClick={() => onStatusClick(product.id)}
            sx={{
              width: "100%",
              backgroundColor: product.statusColor,
              borderRadius: 2,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              color: "white",
              cursor: "pointer",
              py: 1,
              fontSize: 14,
            }}
          >
            {product.status}
          </Box>
        </Box>
      </Box>
    );
  };

  const scheduledProducts = products.filter(
    (product) => product.status === "상품취소"
  );

  const otherProducts = products.filter(
    (product) => product.status !== "상품취소"
  );

  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: "90vh",
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        bgcolor: "background.paper",
        boxShadow: 24,
        display: "flex",
        flexDirection: "column",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        zIndex: "1300",
      }}
    >
      <Box sx={{ position: "sticky", top: 0, backgroundColor: "#ffffff" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
            position: "relative",
            borderBottom: "1px solid rgba(0, 0, 0, 0.20)",
          }}
        >
          <Box
            onClick={handleBackButtonClick}
            sx={{
              cursor: "pointer",
              position: "absolute",
              left: 20,
            }}
          >
            <ArrowBackIosNew />
          </Box>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            거래 상세
          </Typography>
        </Box>
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <AccessTime sx={{ fontSize: 24 }} />
            <Typography sx={{ fontSize: 18 }}>
              2024년 7월 23일 목요일 오후 3시
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <PlaceOutlined sx={{ fontSize: 24 }} />
            <Box>
              <Typography sx={{ fontSize: 18 }}>
                대전광역시 유성구 덕명동
              </Typography>
              <Typography sx={{ fontSize: 18 }}>
                한밭대학교 주차장1 에서
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flexGrow: 1,
          px: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.20)",
              pb: 0.5,
              pl: 1,
            }}
          >
            <Typography sx={{ fontWeight: "800" }}>거래 예정 상품</Typography>
          </Box>
          <Box
            sx={{
              maxHeight: `calc((90vh - 320px) / 2)`,
              overflowY: "auto",
            }}
          >
            {scheduledProducts.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                onStatusClick={handleStatusClick}
              />
            ))}
          </Box>
        </Box>

        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}
        >
          <Box
            sx={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.20)",
              pb: 0.5,
              pl: 1,
            }}
          >
            <Typography sx={{ fontWeight: "800" }}>
              '라이브방제'의 다른 상품(거래완료 전인것만)
            </Typography>
          </Box>
          <Box
            sx={{
              maxHeight: `calc((90vh - 300px) / 2)`,
              overflowY: "auto",
            }}
          >
            {otherProducts.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                onStatusClick={handleStatusClick}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatTradeDetail;
