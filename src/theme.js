import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2D90E0",
      light: "#489FE4",
      dark: "#2782D3",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FF118C",
      light: "#FE53A3",
      dark: "#FF0074",
      contrastText: "#FFFFFF",
    },
    accent: {
      main: "#B8E8B1",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#64CC54",
      light: "#6BCE5B",
      dark: "#3CB534",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#000000",
      paper: "#000000",
      light: "#000000",
    },
    text: {
      primary: "#ffffff",
      secondary: "#cccccc",
      disabled: "#aaaaaa",
    },
    error: {
      main: "#d32f2f",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#ed6c02",
      contrastText: "#FFFFFF",
    },
    info: {
      main: "#0288d1",
      contrastText: "#FFFFFF",
    },
    divider: "#333333", // Dark divider
  },
  typography: {
    fontFamily: "'Montserrat', 'Arial', sans-serif",
    h1: { fontFamily: "'Urbanist', 'Arial', sans-serif", color: "#FFFFFF" },
    h2: { fontFamily: "'Urbanist', 'Arial', sans-serif", color: "#FFFFFF" },
    h3: { fontFamily: "'Urbanist', 'Arial', sans-serif", color: "#FFFFFF" },
    h4: { fontFamily: "'Urbanist', 'Arial', sans-serif", color: "#FFFFFF" },
    h5: { fontFamily: "'Urbanist', 'Arial', sans-serif", color: "#FFFFFF" },
    h6: { fontFamily: "'Urbanist', 'Arial', sans-serif", color: "#FFFFFF" },
    body1: { fontFamily: "'Montserrat', 'Arial', sans-serif", color: "#FFFFFF" },
    body2: { fontFamily: "'Montserrat', 'Arial', sans-serif", color: "#FFFFFF" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
          backgroundColor: "#2D90E0",
          "&:hover": {
            backgroundColor: "#2782D3",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#1e1e1e",
            color: "#FFFFFF",
            "& fieldset": {
              borderColor: "#757575",
            },
            "&:hover fieldset": {
              borderColor: "#FFFFFF",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2D90E0",
            },
            "& input": {
              color: "#FFFFFF",
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
          color: "#FFFFFF",
        },
      },
    },
  },
});

export default theme;
