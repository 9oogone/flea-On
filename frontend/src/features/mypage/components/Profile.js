import React from "react";
import ProfileDefault from "../../../assets/images/profile_default.svg";
import { Container, Avatar, Box, Typography } from "@mui/material";

const Profile = ({ user }) => {
  const userRegion = user?.user_region[0]?.split(" > ").pop() || "플리온";

  return (
    <Container
      sx={{
        mt: 7,
        mb: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Avatar
        src={user?.profilePicture || ProfileDefault}
        alt={`${user?.nickname || "사용자"}'s profile`}
        sx={{ width: 60, height: 60 }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // 이 부분 유지
          mt: 0.5,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "600" }}>
          {user?.nickname || "닉네임"}
        </Typography>
        <Typography>{userRegion} 주민</Typography>
      </Box>
      <Box
        sx={{
          px: 1,
          py: 0.5,
          bgcolor: "#CCCCCC",
          color: "#FFFFFF",
          borderRadius: 5,
          fontSize: 12,
        }}
      >
        프로필 수정
      </Box>
    </Container>
  );
};

export default Profile;
