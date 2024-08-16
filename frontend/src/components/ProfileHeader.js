import React from 'react';
import styles from '../styles/ProfileHeader.module.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const ProfileHeader = ({chat}) => {
  const navigate = useNavigate();
  const goBack = () => {
    // 뒤로가기 버튼 클릭 시 실행할 함수
    navigate("/chat")
    // window.history.back();
  };

  return (
    <div className={styles.header}>
      <button className={styles.backButton} onClick={goBack}>
        <ArrowBackIcon sx={{color: 'black'}}/>
      </button>
      <div className={styles.headerContainer}>
        <img src={chat.profile} alt="Profile" className={styles.profileImage} />
        <span className={styles.nickname}>{chat.userNickName}</span>
      </div>
    </div>
  );
};

export default ProfileHeader;
