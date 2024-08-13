import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../features/mypage/profileEditSlice';
import { useNavigate } from 'react-router-dom';
import { Avatar, TextField, Typography, Box, IconButton, Paper } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import styles from '../styles/ProfileEdit.module.css';

const ProfileEdit = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate 훅 추가

  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [nickname, setNickname] = useState(user.nickname);
  const [phone, setPhone] = useState(user.phone);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (profilePictureFile) {
      formData.append('photoFile', profilePictureFile);
    }
    const profileData = {
      nickname,
      phone,
      profile_picture: "" // 프로필 사진은 항상 빈 문자열로
    };
    formData.append('data', new Blob([JSON.stringify(profileData)], { type: 'application/json' }));

    await dispatch(updateProfile({ email: user.email, formData }));
    navigate('/mypage'); // 프로필 업데이트 후 마이 페이지로 이동
  };

  return (
    <Box className={styles.profileEditContainer}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>내 정보 수정</Typography>
      <Paper elevation={3} className={styles.formContainer} sx={{ boxShadow: 'none' }}>
        <form onSubmit={handleSubmit}>
          <Box className={styles.field}>
            <Typography variant="subtitle1">프로필 사진</Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              style={{ display: 'none' }}
              id="profile-picture-upload"
            />
            <label htmlFor="profile-picture-upload">
              <IconButton color="primary" aria-label="upload picture" component="span">
                {profilePicture ? (
                  <Avatar src={profilePicture} className={styles.avatar} sx={{ width: 100, height: 100 }} />
                ) : (
                  <PhotoCamera />
                )}
              </IconButton>
            </label>
          </Box>
          <Box className={styles.field}>
            <TextField
              label="이메일"
              type="email"
              value={user.email}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
              margin="normal"
            />
          </Box>
          <Box className={styles.field}>
            <TextField
              label="닉네임"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Box>
          <Box className={styles.field}>
            <TextField
              label="전화번호"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Box>
          <Box className={styles.buttonContainer}>
            <button type="submit" className={styles.customButton}>수정하기</button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ProfileEdit;
