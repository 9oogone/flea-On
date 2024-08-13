import React from 'react';
import { Box, Typography } from '@mui/material';

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
    zIndex: 10,
    display: 'inline-block',
    position: 'absolute',
    textAlign: 'center',
    bottom: '45px', 
    left: '15%',
    transform: 'translateX(-50%)',
  },
  tooltipText: {
    zIndex: 10,
    backgroundColor: '#2E2E32',
    color: '#F5F5F5',
    padding: '6px 12px',
    borderRadius: '1px',
    fontSize: '14px',
    fontWeight: 'medium',
    minWidth: '80px',
    boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
    fontFamily: 'Noto Sans KR',
  },
  tooltipArrow: {
    zIndex: 10,
    width: 0,
    height: 0,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderTop: '8px solid #2E2E32',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    top: '100%',
  },
};

export default Tooltip;
