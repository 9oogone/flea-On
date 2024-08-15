import React, { useEffect, useState } from "react";
import { Container, Box, Paper, Typography, Avatar } from "@mui/material";
import baseAxios from "../utils/httpCommons";
import { useSelector } from "react-redux";
const notifications = [
  {
    profileImage: "https://example.com/profile1.jpg",
    content: "This is an unread notification",
    read: false,
  },
  {
    profileImage: "https://example.com/profile2.jpg",
    content: "This is a read notification",
    read: true,
  },
  {
    profileImage: "https://example.com/profile3.jpg",
    content: "Another unread notification",
    read: false,
  },
];

const Notification = () => {
  const [alarms, setAlarms] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const fetchAlarm = ()=>{
    baseAxios().get(`/fleaon/alarms/`).then((res)=>{

      console.log(res)
      setAlarms(res.data)
      toReadAlarm();
    });
  }
  const toReadAlarm = ()=>{
    baseAxios().put('/fleaon/alarms/read');
  }
  useEffect(()=>{
    fetchAlarm();
  },[])

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Notification
      </Typography>
      {alarms.map((alarm, index) => (
        <Paper
        key={index}
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          mb: 2,
          backgroundColor: '#fff',
          border: alarm.read ? "2px solid #fff" : '1px solid #FF0B55', 
          boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px"
        }}
      >
        <Avatar
          alt="Profile Image"
          src={alarm.profilePic}
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body1">{alarm.content}</Typography>
        </Box>
      </Paper>
      

      ))}
    </Container>
  );
};

export default Notification;
