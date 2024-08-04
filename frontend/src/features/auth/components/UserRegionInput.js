import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserRegion } from "../authSlice";
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

const UserRegionInput = () => {
  const dispatch = useDispatch();
  const userRegion = useSelector((state) => state.auth.user.user_region) || [];

  const regions = {
    서울특별시: {
      종로구: ["가회동", "견지동", "경운동", "계동"],
      중구: ["소공동", "회현동", "명동", "필동"],
      용산구: ["갈월동", "남영동", "도원동", "동자동"],
    },
    경기도: {
      수원시: ["장안구", "권선구", "팔달구", "영통구"],
      성남시: ["수정구", "중원구", "분당구"],
    },
    대전: {
      유성구: ["덕명동", "죽동", "봉명동", "도룡동"],
      서구: ["둔산동", "월평동", "탄방동", "용문동"],
    },
  };

  const [selectedSido, setSelectedSido] = useState("");
  const [selectedGugun, setSelectedGugun] = useState("");
  const [selectedEupmyeon, setSelectedEupmyeon] = useState("");

  const handleSidoChange = (sido) => {
    setSelectedSido(sido);
    setSelectedGugun("");
    setSelectedEupmyeon("");
  };

  const handleGugunChange = (gugun) => {
    setSelectedGugun(gugun);
    setSelectedEupmyeon("");
  };

  const handleEupmyeonChange = (eupmyeon) => {
    if (userRegion.length < 3) {
      const newRegion = `${selectedSido} > ${selectedGugun} > ${eupmyeon}`;
      if (!userRegion.includes(newRegion)) {
        const updatedRegions = [...userRegion, newRegion];
        dispatch(setUserRegion(updatedRegions));
      }
    }
  };

  const handleRemoveRegion = (region) => {
    const updatedRegions = userRegion.filter((r) => r !== region);
    dispatch(setUserRegion(updatedRegions));
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        선호 지역을 알려주세요 (최대 3개)
      </Typography>
      <Box sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2 }}>
        <Grid container spacing={2} sx={{ maxHeight: 300, overflow: "auto" }}>
          <Grid item xs={4}>
            <Paper variant="outlined">
              <List>
                {Object.keys(regions).map((sido) => (
                  <ListItem key={sido} disablePadding>
                    <ListItemButton onClick={() => handleSidoChange(sido)}>
                      <ListItemText primary={sido} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper variant="outlined">
              <List>
                {selectedSido &&
                  Object.keys(regions[selectedSido]).map((gugun) => (
                    <ListItem key={gugun} disablePadding>
                      <ListItemButton onClick={() => handleGugunChange(gugun)}>
                        <ListItemText primary={gugun} />
                      </ListItemButton>
                    </ListItem>
                  ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper variant="outlined">
              <List>
                {selectedGugun &&
                  regions[selectedSido][selectedGugun].map((eupmyeon) => (
                    <ListItem key={eupmyeon} disablePadding>
                      <ListItemButton
                        onClick={() => handleEupmyeonChange(eupmyeon)}
                      >
                        <ListItemText primary={eupmyeon} />
                      </ListItemButton>
                    </ListItem>
                  ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
        {userRegion.map((region) => (
          <Chip
            key={region}
            label={region}
            onDelete={() => handleRemoveRegion(region)}
            color="primary"
          />
        ))}
      </Box>
    </Box>
  );
};

export default UserRegionInput;
