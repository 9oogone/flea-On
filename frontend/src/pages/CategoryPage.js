import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid } from "@mui/material";

const CategoryPage = () => {
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // 임시 데이터
  const categories = [
    {
      first_category: "가구",
      second_category: ["침실가구", "거실가구"],
    },
    {
      first_category: "가전",
      second_category: ["냉장고", "세탁기"],
    },
  ];

  const onCategoryClick = useCallback((categoryId) => {
    setSelectedCategoryId(categoryId);
  }, []);

  const onSubCategoryClick = useCallback(
    (subCategoryName) => {
      navigate(`/search?query=${encodeURIComponent(subCategoryName)}`);
    },
    [navigate]
  );

  return (
    <Box padding={2}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          {categories.map((category) => (
            <Box
              key={category.first_category}
              onClick={() => onCategoryClick(category.first_category)}
              textAlign="center"
              sx={{
                cursor: "pointer",
                marginBottom: 2,
                backgroundColor:
                  selectedCategoryId === category.first_category
                    ? "#FFCEDD"
                    : "white",
                color:
                  selectedCategoryId === category.first_category
                    ? "#FF0B55"
                    : "black",
              }}
            >
              <Typography variant="h6">{category.first_category}</Typography>
            </Box>
          ))}
        </Grid>

        <Grid item xs={9}>
          {selectedCategoryId !== null && (
            <Grid container spacing={2}>
              {categories
                .find(
                  (category) => category.first_category === selectedCategoryId
                )
                .second_category.map((subcategory) => (
                  <Grid item xs={9} sm={8} md={8} key={subcategory}>
                    <Box
                      onClick={() => onSubCategoryClick(subcategory)}
                      textAlign="center"
                      sx={{ cursor: "pointer" }}
                    >
                      <Typography variant="h6">{subcategory}</Typography>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CategoryPage;
