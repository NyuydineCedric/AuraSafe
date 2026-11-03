import React, { useState } from "react";
import "./App.css";
import SafetyScanner from "./components/SafetyScanner";
import Dashboard from "./components/Dashboard";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";
import SafetyCheckIcon from "@mui/icons-material/SafetyCheck";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4CAF50", // Safety green
    },
    secondary: {
      main: "#2196F3", // Alert blue
    },
    background: {
      default: "#0a1929",
      paper: "#1a2027",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [scanResults, setScanResults] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="static" color="primary">
          <Toolbar>
            <SafetyCheckIcon sx={{ mr: 2 }} />
            <Typography
              variant="h4"
              component="div"
              sx={{ flexGrow: 1, fontWeight: "bold" }}
            >
              AuraSafe
            </Typography>
            <Typography variant="subtitle1">
              Your Personal Safety Scanner
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <SafetyScanner onScanComplete={setScanResults} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Dashboard scanResults={scanResults} />
            </Box>
          </Box>
        </Container>

        <Box
          sx={{ mt: 8, py: 3, textAlign: "center", color: "text.secondary" }}
        >
          <Typography variant="body2">
            ⚠️ AuraSafe is a safety assistant tool. Always stay alert and use
            common sense.
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            This app uses camera and AI to detect potential threats. No data is
            stored or shared.
          </Typography>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
