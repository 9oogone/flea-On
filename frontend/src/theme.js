// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1C1B1F",
    },
    secondary: {
      main: "#dc004e", // Change this to your desired secondary color
    },
    warning: {
      main: "#ffa000",
    },
    naver: {
      main: "#03c75a",
    },
    kakao: {
      main: "#fee500",
    },
    google: {
      main: "#ffffff",
    },
  },
});

export default theme;
