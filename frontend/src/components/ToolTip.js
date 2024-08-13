import React from 'react';
import { Box, Typography } from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';

const Tooltip = () => {
  return (
    <Box sx={styles.tooltipContainer}>
      <Typography sx={styles.tooltipText}>최근 로그인</Typography>
      <Box sx={styles.tooltipArrow} />
    </Box>
  );
};

const styles = {
  tooltipContainer: {
    zIndex:10,
    display: 'inline-block',
    position: 'relative',
    textAlign: 'center',
  },
  tooltipText: {
    zIndex:10,
    backgroundColor: '#1E1E22',
    color: 'white',
    padding: '6px 12px',  
    borderRadius: '8px',  
    fontSize: '14px',    
    fontWeight: 'bold',
    minWidth: '80px',     
    boxShadow: '0px 2px 5px rgba(0,0,0,0.2)', 
  },
  tooltipArrow: {
    zIndex:10,
    width: 0,
    height: 0,
    borderLeft: '8px solid transparent',  
    borderRight: '8px solid transparent', 
    borderTop: '8px solid #1E1E22',       
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: '-7px',
  }
};

export default Tooltip;
