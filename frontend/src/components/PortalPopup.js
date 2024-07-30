import React from 'react';
import ReactDOM from 'react-dom';
// import './PortalPopup.css';

const PortalPopup = ({ children, overlayColor, placement, onOutsideClick }) => {
  return ReactDOM.createPortal(
    <div className="portal-popup" style={{ backgroundColor: overlayColor }}>
      <div className={`popup-content ${placement}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
      <div className="overlay" onClick={onOutsideClick}></div>
    </div>,
    document.body
  );
};

export default PortalPopup;
