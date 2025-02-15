import React from "react";
import { useEffect } from "react";
import { setPageTitle } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";

export const NotFound = (props) => {
  const navigate = useNavigate();
  useEffect(() => {
    setPageTitle(props.title);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
        color: "#ffffff",
      }}
    >
      <Typography variant="h1" sx={{ color: "#d41169" }}>Not Found</Typography>
      <Typography variant="body1">This page does not exist</Typography>
      <Button
        variant="contained"
        onClick={() => navigate("/dashboard")}
        sx={{
          background: "linear-gradient(80deg, #d41169, #2451d8)",
          color: "#ffffff",
        }}
      >
        Back to home
      </Button>
    </Box>
  );
};
