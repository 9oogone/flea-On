import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sellerform from "../components/Sellerform";
import PortalPopup from "../components/PortalPopup";
import AppBar from "@mui/material/AppBar";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "../styles/BottomAppBar.css";

const BottomAppBar = () => {
  const [isSellerformOpen, setSellerformOpen] = useState(false);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const openSellerform = useCallback(() => {
    setSellerformOpen(true);
  }, []);

  const closeSellerform = useCallback(() => {
    setSellerformOpen(false);
  }, []);

  const onTabClick = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  const goToMyPage = useCallback(() => {
    navigate("/mypage");
  }, [navigate]);
  const goToCategory = useCallback(() => {
    navigate("/category");
  }, [navigate]);
  const goToHome = useCallback(() => {
    navigate("/");
  }, [navigate]);
  const goToChat = useCallback(() => {
    navigate("/chat");
  }, [navigate]);

  // 채팅 경로인지 확인
  const isChatRoom = location.pathname.startsWith("/chat");

  return (
    <>
      {!isSellerformOpen && !isChatRoom && (
        <AppBar
          position="fixed"
          sx={{
            top: "auto",
            bottom: 0,
            borderTop: "0.5px solid #1C1B1F",
            boxShadow: "none",
            zIndex: 1000, // z-index를 낮은 값으로 설정
          }}
        >
          <BottomNavigation value={value} onChange={onTabClick}>
            <BottomNavigationAction
              icon={<HomeIcon className="homeIcon" />}
              className="tab1"
              onClick={goToHome}
            />
            <BottomNavigationAction
              icon={<SearchIcon className="searchIcon" />}
              className="tab2"
              onClick={goToCategory}
            />
            <BottomNavigationAction
              icon={<AddCircleIcon className="AddCircleIcon" />}
              className="tab3"
              onClick={openSellerform}
            />
            <BottomNavigationAction
              icon={<ChatBubbleOutlineIcon className="chatIcon" />}
              className="tab4"
              onClick={goToChat}
            />
            <BottomNavigationAction
              icon={<AccountCircleIcon className="accountIcon" />}
              className="tab5"
              onClick={goToMyPage}
            />
          </BottomNavigation>
        </AppBar>
      )}
      {isSellerformOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeSellerform}
        >
          <Sellerform onClose={closeSellerform} />
        </PortalPopup>
      )}
    </>
  );
};

export default BottomAppBar;
