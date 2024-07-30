import React, { useState, useCallback } from 'react';
import Sellerform from '../components/Sellerform';
import PortalPopup from '../components/PortalPopup';
import AppBar from '@mui/material/AppBar';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
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
          <BottomNavigationAction icon={<AddIcon className="AddIcon" />} onClick={openSellerform} />
          <BottomNavigationAction icon={<ChatIcon className="ChatIcon" />} />
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
