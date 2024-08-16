import React, { useEffect, useRef } from "react";
import styles from "../styles/ChatNav.module.css";
import backicons from "../assets/images/navicon/backicons.svg";
import cancelicons from "../assets/images/navicon/cancelicons.svg";
import detailicons from "../assets/images/navicon/detailicons.svg";
import timeicons from "../assets/images/navicon/timeicons.svg";

const ChatNav = ({ chatID, onClose, onCancelTrade, onTradeDetail, onChangeTime }) => {
  //네브 영역 밖에 선택하면 꺼지게 함
  const instanceParentRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        instanceParentRef.current &&
        !instanceParentRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.chatNav}>
      <div className={styles.backblur}>
        <div className={styles.instanceParent} ref={instanceParentRef}>
          <div className={styles.diconsParent1} onClick={onChangeTime}>
            <img className={styles.dicons} alt="" src={timeicons} />
            <div className={styles.div1}>시간 변경</div>
          </div>
          <div className={styles.diconsParent1} onClick={onTradeDetail}>
            <img className={styles.dicons} alt="" src={detailicons} />
            <div className={styles.div1}>거래 상세</div>
          </div>
          <div className={styles.diconsParent1} onClick={onCancelTrade}>
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