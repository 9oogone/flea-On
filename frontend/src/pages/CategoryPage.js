import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import { fetchCategories } from "../features/category/categorySlice";

const CategoryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);
  // const token = useSelector((state) => state.auth.token); // 토큰 가져오기
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories()); // 토큰을 전달하여 카테고리 가져오기
  }, [dispatch]); // 빈 배열을 추가하여 컴포넌트 마운트 시 한 번만 실행되도록 설정

  const onCategoryClick = useCallback((categoryId) => {
    setSelectedCategoryId(categoryId);
  }, []);

  const onSubCategoryClick = useCallback(
    (subCategoryName) => {
      navigate(`/search?query=${encodeURIComponent(subCategoryName)}`);
    },
    [navigate]
  );

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  const groupedCategories = categories.reduce((acc, category) => {
    const {
      firstCategoryId,
      firstCategoryName,
      secondCategoryId,
      secondCategoryName,
    } = category;
    if (!acc[firstCategoryId]) {
      acc[firstCategoryId] = {
        firstCategoryName,
        secondCategories: [],
      };
    }
    acc[firstCategoryId].secondCategories.push({
      id: secondCategoryId,
      name: secondCategoryName,
    });
    return acc;
  }, {});

  return (
    <Box>
      <Grid container sx={{ marginTop: "12vh", height: "80vh" }}>
        <Grid item xs={6} sx={{ overflowY: "auto", height: "100%" }}>
          {Object.entries(groupedCategories).map(
            ([firstCategoryId, category]) => (
              <Box
                key={firstCategoryId}
                onClick={() => onCategoryClick(firstCategoryId)}
                sx={{
                  cursor: "pointer",
                  height: "6.6vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor:
                    selectedCategoryId === firstCategoryId
                      ? "#FFCEDD"
                      : "white",
                  color:
                    selectedCategoryId === firstCategoryId
                      ? "#FF0B55"
                      : "#666666",
                  // '#2E2E32'
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "18px",
                    fontFamily: "Noto Sans KR",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {category.firstCategoryName}
                </Typography>
              </Box>
            )
          )}
        </Grid>

        <Grid item xs={6} sx={{ overflowY: "auto", height: "100%" }}>
          {selectedCategoryId !== null && (
            <Grid container>
              {groupedCategories[selectedCategoryId].secondCategories.map(
                (subcategory) => (
                  <Grid item xs={12} key={subcategory.id}>
                    <Box
                      onClick={() => onSubCategoryClick(subcategory.name)}
                      textAlign="center"
                      sx={{ cursor: "pointer", mb: 1 }}
                    >
                      <Typography
                        sx={{
                          fontSize: "16px",
                          fontFamily: "Noto Sans KR",
                          letterSpacing: "-0.5px",
                          mt: "10px",
                          mb: "10px",
                          color: "#666666",
                          fontWeight: 400,
                        }}
                      >
                        {subcategory.name}
                      </Typography>
                    </Box>
                  </Grid>
                )
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CategoryPage;
