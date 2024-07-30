import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import '../styles/BottomAppBar.css';

const BottomAppBar = () => {
    return (
      <AppBar position="fixed" color="primary" className="appBar">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" className="menuButton">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className="title">
            Bottom App Bar
          </Typography>
          <div className="grow" />
        </Toolbar>
      </AppBar>
    );
  };
  
  export default BottomAppBar;