const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const clientId = process.env.REACT_APP_CLIENT_ID;
const secretKey = process.env.REACT_APP_SECRET_KEY;

app.post("/api/categories", async (req, res) => {
  const body = {
    startDate: "2023-01-01", // 실제 사용 시 필요한 날짜로 변경하세요
    endDate: "2023-12-31", // 실제 사용 시 필요한 날짜로 변경하세요
    timeUnit: "month",
    category: [],
    device: "",
    gender: "",
    ages: [],
  };

  try {
    const response = await axios.post(
      "https://openapi.naver.com/v1/datalab/shopping/categories",
      body,
      {
        headers: {
          "X-Naver-Client-Id": clientId,
          "X-Naver-Client-Secret": secretKey,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
