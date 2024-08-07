// ChatNav.jsx
import React, { useCallback } from 'react';
import styles from '../styles/ChatNav.module.css';
import backicons from '../assets/images/navicon/backicons.svg';
import cancelicons from '../assets/images/navicon/cancelicons.svg';
import detailicons from '../assets/images/navicon/detailicons.svg';
import timeicons from '../assets/images/navicon/timeicons.svg';

const ChatNav = ({ onClose, onCancelTrade, onChangeTime }) => {

  const onFrameContainerClick = useCallback(() => {
    // 여기에 추가적인 코드를 넣을 수 있습니다
  }, []);

  return (
    <div className={styles.chatNav}>
      <div className={styles.backblur}>
        <div className={styles.instanceParent}>
          <div className={styles.frameDiv} onClick={onChangeTime}> {/* onChangeTime 핸들러 추가 */}
            <img className={styles.dicons} alt="" src={timeicons} />
            <div className={styles.div1}>시간 변경</div>
          </div>
          <div className={styles.diconsParent1} onClick={onFrameContainerClick}>
            <img className={styles.dicons} alt="" src={detailicons} />
            <div className={styles.div1}>거래 상세</div>
          </div>
          <div className={styles.frameDiv} onClick={onCancelTrade}>
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
