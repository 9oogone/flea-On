import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../features/mypage/profileEditSlice';
import styles from '../styles/ProfileEdit.module.css';

const ProfileEdit = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [nickname, setNickname] = useState(user.nickname);
  const [phone, setPhone] = useState(user.phone);

  const handleSubmit = (e) => {
    e.preventDefault();
    const profileData = {
      profile_picture: profilePicture,
      nickname,
      phone,
    };
    dispatch(updateProfile({ email: user.email, profileData }));
  };

  return (
    <div className={styles.profileEditContainer}>
      <h2>프로필 수정</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>이메일</label>
          <input type="email" value={user.email} readOnly />
        </div>
        <div className={styles.field}>
          <label>프로필 사진</label>
          <input
            type="text"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label>닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label>전화번호</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button type="submit">수정하기</button>
      </form>
    </div>
  );
};

export default ProfileEdit;
