import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";
import baseAxios from "../utils/httpCommons";

const LiveFooter = ({ name, dongName, title, price, id }) => {
  const [index, setIndex] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await baseAxios().get(`/fleaOn/live/${id}/detail`);
        for (let i = 0; i < response.data.products.length; i++) {
          const product = response.data.products[i];
          if (product.sellStatus < 2) {
            setIndex(i);
            break;
          }
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  return (
    <Box
      sx={{
        top: 206,
        left: "7.50px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {name[index]}
          </Typography>
          <Typography
            sx={{
              color: "white",
              fontSize: 8,
              fontWeight: 400,
            }}
          >
            <LocationOnIcon sx={{ fontSize: "8px" }} />
            {dongName}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontSize: 10,
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              color: "white",
              fontSize: 10,
              fontWeight: 500,
            }}
          >
            {price[index]}원
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LiveFooter;
