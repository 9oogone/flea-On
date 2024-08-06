import React from 'react';
import styles from '../styles/ProfileHeader.module.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ProfileHeader = () => {
  const goBack = () => {
    // 뒤로가기 버튼 클릭 시 실행할 함수
    window.history.back();
  };

  return (
    <div className={styles.header}>
      <button className={styles.backButton} onClick={goBack}>
        <ArrowBackIcon />
      </button>
      <div className={styles.headerContainer}>
        <img src="https://picsum.photos/100/100" alt="Profile" className={styles.profileImage} />
        <span className={styles.nickname}>초합금 고라니</span>
      </div>
    </div>
  );
};

export default ProfileHeader;
