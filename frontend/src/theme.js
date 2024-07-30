// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#ff0b55", // Change this to your desired secondary color
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
