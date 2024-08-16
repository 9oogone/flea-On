import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../features/mypage/profileEditSlice";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  TextField,
  Typography,
  Box,
  Paper,
  Button,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import styles from "../styles/ProfileEdit.module.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
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
      formData.append("photoFile", profilePictureFile);
    }
    const profileData = {
      nickname,
      phone,
      profile_picture: "", // 프로필 사진은 항상 빈 문자열로
    };
    formData.append(
      "data",
      new Blob([JSON.stringify(profileData)], { type: "application/json" })
    );

    await dispatch(updateProfile({ email: user.email, formData }));
    navigate("/mypage"); // 프로필 업데이트 후 마이 페이지로 이동
  };
  const handleBackButtonClick = () => {
    // 이전 페이지로 이동
    navigate("/mypage");
  };
  return (
    <Box className={styles.profileEditContainer}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          pt: 2,
          pb: 1,
          left: 0,
          zIndex: 1000,
        }}
      >
        <Box
          onClick={handleBackButtonClick}
          sx={{
            cursor: "pointer",
            position: "absolute",
            left: 24,
          }}
        >
          <ArrowBackIosNewIcon />
        </Box>
        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          내 정보 수정
        </Typography>
      </Box>
      <Paper
        elevation={3}
        className={styles.formContainer}
        sx={{ boxShadow: "none" }}
      >
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", justifyContent: "center", pb: 2 }}>
            {profilePicture ? (
              <Avatar
                src={profilePicture}
                className={styles.avatar}
                sx={{ width: 100, height: 100 }}
              />
            ) : (
              <PhotoCamera />
            )}
          </Box>
          <Box className={styles.field}>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              style={{ display: "none" }}
              id="profile-picture-upload"
            />
            <label htmlFor="profile-picture-upload">
              <Button
                aria-label="upload picture"
                component="span"
                variant="outlined"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 0.5,
                  px: 1,
                  gap: 0.8,
                }}
              >
                <PhotoCamera sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 12, color: "rgb(113,113,113)" }}>
                  사진 바꾸기
                </Typography>
              </Button>
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
            <button type="submit" className={styles.customButton}>
              수정하기
            </button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ProfileEdit;
