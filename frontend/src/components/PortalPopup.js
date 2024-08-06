import React, { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from '../styles/PortalPopup.module.css';

const PortalPopup = ({
  children,
  overlayColor,
  placement = "Centered",
  onOutsideClick,
  zIndex = 100,
  left = 0,
  right = 0,
  top = 0,
  bottom = 0,
  relativeLayerRef
}) => {
  const relContainerRef = useRef(null);
  const [relativeStyle, setRelativeStyle] = useState({
    opacity: 0,
  });

  const popupClass = useMemo(() => {
    switch (placement) {
      case "Top left":
        return styles.topLeft;
      case "Top center":
        return styles.topCenter;
      case "Top right":
        return styles.topRight;
      case "Bottom left":
        return styles.bottomLeft;
      case "Bottom center":
        return styles.bottomCenter;
      case "Bottom right":
        return styles.bottomRight;
      case "Centered":
      default:
        return styles.centered;
    }
  }, [placement]);

  const popupStyle = useMemo(() => {
    const style = {
      zIndex,
      backgroundColor: overlayColor || "transparent",
      opacity: 1
    };
    return style;
  }, [overlayColor, zIndex]);

  const setPosition = useCallback(() => {
    const relativeItem = relativeLayerRef?.current?.getBoundingClientRect();
    const containerItem = relContainerRef?.current?.getBoundingClientRect();
    const style = { opacity: 1 };
    if (relativeItem && containerItem) {
      const { x: relativeX, y: relativeY, width: relativeW, height: relativeH } = relativeItem;
      const { width: containerW, height: containerH } = containerItem;
      style.position = "absolute";
      switch (placement) {
        case "Top left":
          style.top = relativeY - containerH - top;
          style.left = relativeX + left;
          break;
        case "Top right":
          style.top = relativeY - containerH - top;
          style.left = relativeX + relativeW - containerW - right;
          break;
        case "Bottom left":
          style.top = relativeY + relativeH + bottom;
          style.left = relativeX + left;
          break;
        case "Bottom right":
          style.top = relativeY + relativeH + bottom;
          style.left = relativeX + relativeW - containerW - right;
          break;
        default:
          style.top = "50%";
          style.left = "50%";
          style.transform = "translate(-50%, -50%)";
          break;
      }
      setRelativeStyle(style);
    } else {
      style.maxWidth = "90%";
      style.maxHeight = "90%";
      setRelativeStyle(style);
    }
  }, [left, right, top, bottom, placement, relativeLayerRef]);

  useEffect(() => {
    setPosition();
    window.addEventListener('resize', setPosition);
    window.addEventListener('scroll', setPosition, true);
    return () => {
      window.removeEventListener('resize', setPosition);
      window.removeEventListener('scroll', setPosition, true);
    };
  }, [setPosition]);

  const onOverlayClick = useCallback(
    (e) => {
      if (onOutsideClick && e.target.classList.contains(styles.portalPopupOverlay)) {
        onOutsideClick();
      }
      e.stopPropagation();
    },
    [onOutsideClick]
  );

  return (
    <Portal>
      <div
        className={`${styles.portalPopupOverlay} ${popupClass}`}
        style={popupStyle}
        onClick={onOverlayClick}>
        <div ref={relContainerRef} style={relativeStyle}>
          {children}
        </div>
      </div>
    </Portal>
  );
};

const Portal = ({ children, containerId = "portals" }) => {
  let portalsDiv = document.getElementById(containerId);
  if (!portalsDiv) {
    portalsDiv = document.createElement("div");
    portalsDiv.setAttribute("id", containerId);
    document.body.appendChild(portalsDiv);
  }
  return createPortal(children, portalsDiv);
};

export default PortalPopup;
