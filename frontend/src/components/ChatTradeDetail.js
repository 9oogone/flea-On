import React, { useState,useEffect } from "react";
import { Box, Typography, Modal } from "@mui/material";
import {
  ArrowBackIosNew,
  AccessTime,
  PlaceOutlined,
  ShopOutlined,
} from "@mui/icons-material";
import { getTradeDetail } from "../features/chat/ChatApi";
import useDidMountEffect from "../utils/useDidMountEffect";
import baseAxios from "../utils/httpCommons";
import { useSelector } from "react-redux";


const ChatTradeDetail = ({ chatID, isOpen, onClose }) => {
  const user = useSelector((state) => state.auth.user);
  const [detail, setDetail] = useState({});
  const [buyProducts, setBuyProducts] = useState([])
  const [otherProducts, setOtherProducts] = useState([])
  
  useDidMountEffect(()=>{
    getTradeDetail(chatID).then((res)=>{
      setDetail(res);
    })
    // console.log(chatID)
  },[chatID])

  useDidMountEffect(()=>{
    if(detail!=null){
      console.log("ssss")
    console.log(detail)
    setBuyProducts(detail.buyProduct)
    console.log(detail.buyProduct)
    setOtherProducts(detail.otherProduct)
    console.log(detail.otherProduct)
  }
  },[detail])

  if (!isOpen) return null;

  const handleBuy = async (productId) => {
    try {
      const response = await baseAxios().post("/fleaon/purchase/buy", {
        productId: productId,
        userId: user.userId,
      });

      // 요청이 성공했을 때 모달을 엽니다.
      if (response.status === 200) {
        console.log(response);
      } else {
        // 요청이 성공하지 않았을 때의 처리를 여기에 추가하세요.
        console.error("Purchase failed:", response);
      }
    } catch (error) {
      // 요청이 실패했을 때의 처리를 여기에 추가하세요.
      console.error("Error purchasing product:", error);
    }
  };
  const handleReserve = async (productId) => {
      const response = await baseAxios().post("/fleaon/purchase/reserve", {
        productId: productId,
        userId: user.userId,
      });
  };
  const handleCancelReserve = async (productId) => {
      const response = await baseAxios().delete("/fleaon/purchase/reserve", {
        productId: productId,
        userId: user.userId,
      });
  };

  const handleBackButtonClick = () => {
    onClose(true);
  };
  const handleTradeCancel = async (id) => {
    const response = await baseAxios().delete("/fleaon/purchase/cancel", {
      productId: id,
      userId: user.userId,
    });
    //구매취소 로직
  }
  const handleStatusClick = (id, reservationCount) => {
    if(reservationCount==0){
      //구매하기
      handleBuy(id);
    }else if(reservationCount>5){
      //줄 마감
    }else if(reservationCount==-3){ 
      //예약 취소
      handleCancelReserve(id)
    }else{
      //예약 하기
      handleReserve(id)
    }

    // setProducts((prev) =>
    //   prev.map((product) =>
    //     product.id === id
    //       ? {
    //           ...product,
    //           status:
    //             product.status === "상품취소"
    //               ? "상품추가"
    //               : product.status === "상품추가"
    //               ? "상품취소"
    //               : product.status === "줄 서기"
    //               ? "줄 취소"
    //               : product.status === "줄 취소"
    //               ? "줄 서기"
    //               : product.status,
    //           statusColor:
    //             product.status === "상품취소"
    //               ? "#FF0B55"
    //               : product.status === "상품추가"
    //               ? "#FF0B55"
    //               : product.status === "줄 서기"
    //               ? "#FF5757"
    //               : product.status === "줄 취소"
    //               ? "#FF5757"
    //               : "#CCCCCC",
    //         }
    //       : product
    //   )
    // );

  };

  const ProductItem = ({ product,productStatus, onStatusClick }) => {
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
            textAlign: "end",
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
            onClick={() => onStatusClick(product.id, product.reservationCount)}
            sx={{
              width: "100%",
              backgroundColor: product.reservationCount==0?'#FF0B55':product.reservationCount>5?'gray':product.reservationCount==-3?'red':'#FF5757',
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
            {productStatus}
          </Box>
        </Box>
      </Box>
    );
  };

  // const scheduledProducts = products.filter(
  //   (product) => product.status === "상품취소"
  // );

  // const otherProducts = products.filter(
  //   (product) => product.status !== "상품취소"
  // );

  return (
    <Modal open={isOpen} onClose={onClose}>
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
                {detail.tradeDate} {detail.tradeTime}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <PlaceOutlined sx={{ fontSize: 24 }} />
              <Box>
                <Typography sx={{ fontSize: 18 }}>
                  {/* 대전광역시 유성구 덕명동 */}
                  {detail.tradePlace}
                </Typography>
                {/* <Typography sx={{ fontSize: 18 }}>한밭대학교 주차장1 에서 </Typography> */}
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
              {buyProducts.map((product,index) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  productStatus = "거래 취소"
                  onStatusClick={()=>handleTradeCancel(product.id)}
                />
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
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
              {otherProducts.map((product,index) => (
                <ProductItem
                  key={product.id || `p${index}`}
                  product={product}
                  productStatus={product.reservationCount==0?"상품추가":product.reservationCount>5?"줄 마감":product.reservationCount==-3?"줄 취소":"줄 서기"}
                  onStatusClick={()=>handleStatusClick(product.id,product.reservationCount)}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ChatTradeDetail;
