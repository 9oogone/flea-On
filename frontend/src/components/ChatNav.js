// ChatNav.jsx
import React, { useCallback } from 'react';
import styles from '../styles/ChatNav.module.css';
import locationicons from '../assets/images/navicon/locationicons.svg';
import backicons from '../assets/images/navicon/backicons.svg';
// import cameraicons from '../assets/images/navicon/cameraicons.svg'; // 카메라
import cancelicons from '../assets/images/navicon/cancelicons.svg';
import detailicons from '../assets/images/navicon/detailicons.svg';
import timeicons from '../assets/images/navicon/timeicons.svg';
// import photoicons from '../assets/images/navicon/photoicons.svg'; // 사진

const ChatNav = ({ onClose }) => {

  const onFrameContainerClick = useCallback(() => {
    // Add your code here
  }, []);

  return (
    <div className={styles.chatNav}>
      <div className={styles.backblur}>
        <div className={styles.instanceParent}>
          <div className={styles.diconsParent}>
            <img className={styles.dicons} alt="" src={locationicons} />
            <div className={styles.div1}>위치</div>
          </div>
          {/* <div className={styles.diconsParent}>
            <img className={styles.dicons} alt="" src={photoicons} />
            <div className={styles.div1}>사진</div>
          </div>
          <div className={styles.diconsParent}>
            <img className={styles.dicons} alt="" src={cameraicons} />
            <div className={styles.div1}>카메라</div>
          </div> */}
          <div className={styles.frameDiv}>
            <img className={styles.dicons} alt="" src={timeicons} />
            <div className={styles.div1}>시간 변경</div>
          </div>
          <div className={styles.diconsParent1} onClick={onFrameContainerClick}>
            <img className={styles.dicons} alt="" src={detailicons} />
            <div className={styles.div1}>거래 상세</div>
          </div>
          <div className={styles.frameDiv}>
            <img className={styles.dicons} alt="" src={cancelicons} />
            <div className={styles.div1}>거래 취소</div>
          </div>
          <div className={styles.diconsParent1} onClick={onClose}>
            <img className={styles.dicons} alt="" src={backicons} />
            <div className={styles.div1}>돌아가기</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatNav;
