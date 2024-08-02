// SwitchComponent.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { switchTab } from "../features/home/contentSlice";
import { ButtonGroup, Button } from "@mui/material";

const Switch = ({ options }) => {
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => state.content.selectedTab);

  const handleSwitch = (tab) => {
    dispatch(switchTab(tab));
  };

  return (
    <ButtonGroup variant="contained" sx={{ borderRadius: "100px" }}>
      {options.map((option) => (
        <Button
          key={option.value}
          onClick={() => handleSwitch(option.value)}
          color={selectedTab === option.value ? "primary" : "google"}
          sx={{ width: "50%", borderRadius: "100px" }}
        >
          {option.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default Switch;
