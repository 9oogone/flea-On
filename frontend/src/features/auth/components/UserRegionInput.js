import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSidos, fetchGuguns, fetchEupmyeons } from "../../region/actions";
import { setUserRegion, removeUserRegion } from "../../auth/authSlice"; // authSlice에서 필요한 액션을 import
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import baseAxios from "../../../utils/httpCommons";
const UserRegionInput = () => {
  const dispatch = useDispatch();
  const userRegion = {
    dongName: useSelector((state) => state.auth.user.dongName) || [],
    regionCode: useSelector((state) => state.auth.user.regionCode) || [],
  };
  const regions = useSelector((state) => state.region);
  const loading = useSelector((state) => state.region.loading);

  const [selectedSido, setSelectedSido] = useState("");
  const [selectedGugun, setSelectedGugun] = useState("");
  const [selectedEupmyeon, setSelectedEupmyeon] = useState("");

  useEffect(() => {
    dispatch(fetchSidos());
  }, [dispatch]);

  const handleSidoChange = (sido) => {
    setSelectedSido(sido);
    setSelectedGugun("");
    setSelectedEupmyeon("");
    dispatch(fetchGuguns(sido));
  };

  const handleGugunChange = (gugun) => {
    setSelectedGugun(gugun.gugunName);
    setSelectedEupmyeon("");
    dispatch(
      fetchEupmyeons({ sidoName: selectedSido, gugunName: gugun.gugunName })
    );
  };

  const handleEupmyeonChange = (eupmyeon) => {
    if (userRegion.dongName.length < 3) {
      baseAxios().post(
        `/fleaon/users/region?regionCode=${eupmyeon.regionCode}`
      );
      const newRegion = {
        dongName: `${eupmyeon.eupmyeonName}`,
        regionCode: eupmyeon.regionCode,
      };
      if (
        !userRegion.dongName.some((region) => region === newRegion.dongName)
      ) {
        const updatedRegions = {
          dongName: [...userRegion.dongName, newRegion.dongName],
          regionCode: [...userRegion.regionCode, newRegion.regionCode],
        };
        dispatch(setUserRegion(updatedRegions));
      }
    }
  };

  const handleRemoveRegion = (regionName, regionCode) => {
    baseAxios().delete(`/fleaon/users/region?regionCode=${regionCode}`);
    const updatedDongName = userRegion.dongName.filter((r) => r !== regionName);
    const updatedRegionCode = userRegion.regionCode.filter(
      (r) => r !== regionCode
    );

    const updatedRegions = {
      dongName: updatedDongName,
      regionCode: updatedRegionCode,
    };

    dispatch(setUserRegion(updatedRegions));
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        선호 지역을 알려주세요 (최대 3개)
      </Typography>
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2,
          p: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <Typography>로딩 중...</Typography>
        ) : (
          <Grid container>
            <Grid item xs={4}>
              <Paper
                sx={{
                  border: 0,
                  boxShadow: "none",
                  maxHeight: 300,
                  overflow: "auto",
                }}
              >
                <List>
                  {regions.sidos.map((sido) => (
                    <ListItem
                      key={sido.sidoName}
                      sx={
                        selectedSido === sido.sidoName
                          ? {
                              color: "#ffffff",
                              backgroundColor: "#FF0B55",
                            }
                          : { color: "" }
                      }
                      disablePadding
                    >
                      <ListItemButton
                        sx={{ textAlign: "center" }}
                        onClick={() => handleSidoChange(sido.sidoName)}
                      >
                        <ListItemText primary={sido.sidoName} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                sx={{
                  border: 0,
                  boxShadow: "none",
                  maxHeight: 300,
                  overflow: "auto",
                }}
              >
                <List>
                  {selectedSido &&
                    regions.guguns[selectedSido]?.map((gugun) => (
                      <ListItem
                        sx={
                          selectedGugun === gugun.gugunName
                            ? {
                                color: "#FF0B55",
                                backgroundColor: "pink",
                              }
                            : { color: "" }
                        }
                        key={gugun.gugunName}
                        disablePadding
                      >
                        <ListItemButton
                          sx={{ textAlign: "center" }}
                          onClick={() => handleGugunChange(gugun)}
                        >
                          <ListItemText primary={gugun.gugunName} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                sx={{
                  border: 0,
                  boxShadow: "none",
                  maxHeight: 300,
                  overflow: "auto",
                }}
              >
                <List>
                  {selectedGugun &&
                    regions.eupmyeons[selectedSido]?.[selectedGugun]?.map(
                      (eupmyeon) => (
                        <ListItem key={eupmyeon.regionCode} disablePadding>
                          <ListItemButton
                            sx={{ textAlign: "center" }}
                            onClick={() => handleEupmyeonChange(eupmyeon)}
                          >
                            <ListItemText primary={eupmyeon.eupmyeonName} />
                          </ListItemButton>
                        </ListItem>
                      )
                    )}
                </List>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
        {userRegion.dongName.map((region, index) => {
          // user.regionCode 배열에서 index에 해당하는 code 값을 가져옴
          const regionCode = userRegion.regionCode[index];

          return (
            <Chip
              key={region}
              label={region}
              onDelete={() => handleRemoveRegion(region, regionCode)}
              color="secondary"
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default UserRegionInput;
