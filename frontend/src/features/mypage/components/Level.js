import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateSalesCount } from "../levelSlice";
import { Box, Typography, Avatar, LinearProgress, Button } from "@mui/material";

const UserLevel = () => {
  const dispatch = useDispatch();
  const salesCount = useSelector((state) => state.level.salesCount);
  const level = useSelector((state) => state.level.level);
  const nextLevel = useSelector((state) => state.level.nextLevel);
  const levelIcon = useSelector((state) => state.level.levelIcon);
  const nextLevelIcon = useSelector((state) => state.level.nextLevelIcon);
  const salesGoal = useSelector((state) => state.level.salesGoal);
  const remainingSales = salesGoal - salesCount;
  const progressValue = (salesCount / salesGoal) * 100;

  const handleUpdateSalesCount = () => {
    dispatch(updateSalesCount(salesCount + 1));
  };

  const getProfileStyles = () => {
    switch (level) {
      case "아기손":
        return {
          color: "#8D751C", //텍스트 색
          barColor: "linear-gradient(270deg, #FFFACC 0%, #E6E6E6 100%)", //이게 게이지 배경색
          progressColor: "#E6E6E6", //이게 게이지바 색
        };
      case "작은손":
        return {
          color: "#961B11",
          barColor: "linear-gradient(270deg, #FEE8CD 0%, #FFFACC 100%)",
          progressColor: "linear-gradient(270deg, #FB8A05 0%, #FEE500 100%)",
        };
      case "중간손":
        return {
          color: "#681313",
          barColor: "linear-gradient(270deg, #FFCEDD 0%, #FEE8CD 100%)",
          progressColor: "linear-gradient(270deg, #FF0B55 0%, #FB8A05 100%)",
        };
      case "큰손":
        return {
          color: "#FFFFFF",
          barColor: "#FF0B55",
          progressColor: "#FF0B55",
        };
      default:
        return {
          color: "#FFFFFF",
          barColor: "linear-gradient(270deg, #E6E6E6 0%, #B9B9B9 100%)",
          progressColor: "linear-gradient(270deg, #E6E6E6 0%, white 100%)",
        };
    }
  };

  const profileStyles = getProfileStyles();

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "white",
        borderRadius: "20px",
        boxShadow: "0px 0px 12px rgba(13, 39, 105, 0.10)",
        border: "2px solid rgba(243, 242, 241, 0.20)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "flex-start",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
          }}
        >
          <Box
            component="img"
            src={levelIcon}
            alt={`${level} 아이콘`}
            sx={{ width: "100%", height: "100%" }}
          />
        </Avatar>
        <Box>
          <Typography sx={{ fontSize: 17, fontWeight: 600, color: "#2E2E2E" }}>
            {level}
          </Typography>
          {level !== "큰손" ? (
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(0, 0, 0, 0.3)",
              }}
            >
              {`${remainingSales}개만 더 거래하면 ${nextLevel}!`}
            </Typography>
          ) : (
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(0, 0, 0, 0.3)",
              }}
            >
              {`지금까지 ${salesCount}개를 거래했어요!`}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ width: "100%", position: "relative" }}>
        <LinearProgress
          variant="determinate" //진행상황을 나타내는 옵션
          value={progressValue} //진행정도
          sx={{
            height: 30,
            borderRadius: 5,
            background: profileStyles.barColor,
            "& .MuiLinearProgress-bar": {
              background: profileStyles.progressColor,
              borderRadius: 5, // 게이지 바 끝을 둥글게
              margin: "0 10px", // 바깥과의 간격
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            right: 30,
            transform: "translateY(-50%)",
            fontSize: 12,
            fontWeight: 600,
            color: profileStyles.color,
          }}
        >
          {salesCount}/{salesGoal}
        </Box>
        {level !== "큰손" && (
          <Avatar
            sx={{
              width: 24,
              height: 24,
              position: "absolute",
              top: "50%",
              right: 3,
              transform: "translateY(-50%)",
            }}
          >
            <Box
              component="img"
              src={nextLevelIcon}
              alt={`${nextLevel} 아이콘`}
              sx={{ width: "100%", height: "100%" }}
            />
          </Avatar>
        )}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdateSalesCount}
        sx={{ mt: 2 }}
      >
        판매 갯수 업데이트
      </Button>
    </Box>
  );
};

export default UserLevel;
