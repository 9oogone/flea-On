import React, { useState, useCallback } from 'react';
import Sellerform from '../components/Sellerform';
import PortalPopup from '../components/PortalPopup';
import AppBar from '@mui/material/AppBar';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import Box from '@mui/material/Box';
import '../styles/BottomAppBar.css';

const TabBar = () => {
  const [isSellerformOpen, setSellerformOpen] = useState(false);
  const [value, setValue] = useState(0);

  const openSellerform = useCallback(() => {
    setSellerformOpen(true);
  }, []);

  const closeSellerform = useCallback(() => {
    setSellerformOpen(false);
  }, []);

  const onTabClick = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  return (
    <>
      <AppBar position="fixed" sx={{ top: 'auto', bottom: 0 }}>
        <BottomNavigation value={value} onChange={onTabClick}>
          <BottomNavigationAction icon={<HomeIcon className="homeIcon" />} />
          <BottomNavigationAction icon={<SearchIcon className="SearchIcon" />} />
          <BottomNavigationAction icon={<AddCircleIcon className="AddCircleIcon" />} onClick={openSellerform} />
          <BottomNavigationAction icon={<ChatBubbleOutlineIcon className="ChatBubbleOutlineIcon" />} />
          <BottomNavigationAction icon={<AccountCircleIcon className="AccountCircleIcon" />} />
        </BottomNavigation>
      </AppBar>
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

export default TabBar;
