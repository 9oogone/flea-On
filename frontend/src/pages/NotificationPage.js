import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Avatar } from "@mui/material";
import baseAxios from "../utils/httpCommons";
import { useSelector } from "react-redux";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { getRelativeDate } from "../utils/cssUtils";
const Notification = () => {
  const navigate = useNavigate();
  const [alarms, setAlarms] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const fetchAlarm = () => {
    baseAxios()
      .get(`/fleaon/alarms/`)
      .then((res) => {
        console.log(res);
        setAlarms(res.data);
        toReadAlarm();
      });
  };
  const toReadAlarm = () => {
    baseAxios().put("/fleaon/alarms/read");
  };
  useEffect(() => {
    fetchAlarm();
  }, []);

  const handleBackButtonClick = () => {
    navigate("/");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "rgba(0, 0, 0, 0.03)" }}>
      <Box sx={{ mb: 7 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "fixed",
            width: "100%",
            pt: 2,
            pb: 3,
            left: 0,
            backgroundColor: "white",
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
            알림
          </Typography>
        </Box>

        <Box
          sx={{
            pt: 12,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {alarms.map((alarm, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
                mb: 2,
                background: alarm.read
                  ? "#fff"
                  : "linear-gradient(100deg, rgba(255, 87, 87, 0.18) 50%, rgba(255, 11, 85, 0.18) 100%)",
                border: alarm.read ? "2px solid #fff" : "0px",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
                width: "80%",
                zIndex: 1,
              }}
            >
              <Avatar
                alt="Profile Image"
                src={alarm.profilePic}
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                {alarm.read}
                <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
                  {alarm.content}
                </Typography>
                <Typography
                  sx={{
                    alignSelf: "stretch",
                    color: "rgba(128, 128, 128, 0.55)",
                    fontSize: 11,
                    wordWrap: "break-word",
                  }}
                >
                  {getRelativeDate(alarm.date)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Notification;
