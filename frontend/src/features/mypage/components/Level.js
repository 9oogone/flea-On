import React from "react";
import { Box, Typography, Avatar, LinearProgress } from "@mui/material";
import levelBaby from "../../../assets/images/level_baby.svg";
import levelSmall from "../../../assets/images/level_small.svg";
import levelMiddle from "../../../assets/images/level_middle.svg";
import levelBig from "../../../assets/images/level_big.svg";

const levels = [
  {
    name: "아기손",
    minSales: 0,
    maxSales: 1,
    icon: levelBaby,
  },
  {
    name: "작은손",
    minSales: 2,
    maxSales: 5,
    icon: levelSmall,
  },
  {
    name: "중간손",
    minSales: 7,
    maxSales: 25,
    icon: levelMiddle,
  },
  {
    name: "큰손",
    minSales: 26,
    maxSales: "MAX",
    icon: levelBig,
  },
];

const UserLevel = ({ level }) => {
  const salesCount = level;
  // 현재 레벨과 다음 레벨 찾기
  let currentLevel, nextLevel;
  for (let i = 0; i < levels.length; i++) {
    if (salesCount < levels[i].maxSales || levels[i].maxSales === "MAX") {
      currentLevel = levels[i];
      nextLevel = levels[i + 1] || null;
      break;
    }
  }

  const remainingSales = nextLevel ? currentLevel.maxSales - salesCount : 0;
  const progressValue =
    currentLevel.maxSales === "MAX"
      ? 100
      : (salesCount / currentLevel.maxSales) * 100;

  const getProfileStyles = () => {
    switch (currentLevel.name) {
      case "아기손":
        return {
          color: "#8D751C",
          barColor: "linear-gradient(270deg, #FFFACC 0%, #E6E6E6 100%)",
          progressColor: "#E6E6E6",
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
        pb: 2.5,
        backgroundColor: "white",
        borderRadius: "20px",
        boxShadow: "0px 0px 12px rgba(13, 39, 105, 0.10)",
        border: "2px solid rgba(243, 242, 241, 0.20)",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
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
            src={currentLevel.icon}
            alt={`${currentLevel.name} 아이콘`}
            sx={{ width: "100%", height: "100%" }}
          />
        </Avatar>
        <Box>
          <Typography sx={{ fontSize: 17, fontWeight: 600, color: "#2E2E2E" }}>
            {currentLevel.name}
          </Typography>
          {currentLevel.name !== "큰손" ? (
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(0, 0, 0, 0.3)",
              }}
            >
              {`${remainingSales}개만 더 거래하면 ${nextLevel.name}!`}
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
          variant="determinate"
          value={progressValue}
          sx={{
            height: 30,
            borderRadius: 5,
            background: profileStyles.barColor,
            "& .MuiLinearProgress-bar": {
              background: profileStyles.progressColor,
              borderRadius: 5,
              margin: "0 10px",
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
          {salesCount}/
          {currentLevel.maxSales === "MAX" ? "MAX" : currentLevel.maxSales}
        </Box>
        {currentLevel.name !== "큰손" && (
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
              src={nextLevel.icon}
              alt={`${nextLevel.name} 아이콘`}
              sx={{ width: "100%", height: "100%" }}
            />
          </Avatar>
        )}
      </Box>
    </Box>
  );
};

export default UserLevel;
