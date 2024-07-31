import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid } from "@mui/material";

const CategoryPage = () => {
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // 임시 데이터
  const categories = [
    {
      id: 1,
      name: "가구",
      subCategory: [
        { id: 1, name: "침실가구" },
        { id: 2, name: "거실가구" },
      ],
    },
    {
      id: 2,
      name: "가전",
      subCategory: [
        { id: 3, name: "냉장고" },
        { id: 4, name: "세탁기" },
      ],
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
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
              textAlign="center"
              sx={{
                cursor: "pointer",
                marginBottom: 2,
                backgroundColor:
                  selectedCategoryId === category.id ? "#FFCEDD" : "white",
                color: selectedCategoryId === category.id ? "#FF0B55" : "black",
              }}
            >
              <Typography variant="h6">{category.name}</Typography>
            </Box>
          ))}
        </Grid>

        <Grid item xs={9}>
          {selectedCategoryId !== null && (
            <Grid container spacing={2}>
              {categories
                .find((category) => category.id === selectedCategoryId)
                .subCategory.map((subcategory) => (
                  <Grid item xs={9} sm={8} md={8} key={subcategory.id}>
                    <Box
                      onClick={() => onSubCategoryClick(subcategory.name)}
                      border={1}
                      padding={2}
                      textAlign="center"
                      sx={{ cursor: "pointer" }}
                    >
                      <Typography variant="h6">{subcategory.name}</Typography>
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
