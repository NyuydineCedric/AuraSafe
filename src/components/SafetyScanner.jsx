import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  CameraAlt as CameraIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Nightlight as NightIcon,
  WbSunny as DayIcon,
} from "@mui/icons-material";

const SafetyScanner = ({ onScanComplete }) => {
  const webcamRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState("ready");
  const [scanTime, setScanTime] = useState(null);
  const [scanMode, setScanMode] = useState("day"); // 'day' or 'night'
  const [cameraError, setCameraError] = useState(null);

  // Mock detection results - in real app, this would come from AI/ML model
  const mockDetections = [
    { type: "person", confidence: 85, distance: "15m", threatLevel: "medium" },
    { type: "animal", confidence: 92, distance: "8m", threatLevel: "low" },
    { type: "vehicle", confidence: 78, distance: "25m", threatLevel: "low" },
  ];

  const calculateOverallSafety = useCallback((detections) => {
    const hasHighThreat = detections.some((d) => d.threatLevel === "high");
    const hasMediumThreat = detections.some((d) => d.threatLevel === "medium");

    if (hasHighThreat) return "danger";
    if (hasMediumThreat) return "caution";
    return "safe";
  }, []);

  const generateRecommendations = useCallback(
    (detections) => {
      const recommendations = [];

      if (
        detections.some(
          (d) => d.type === "person" && d.threatLevel === "medium",
        )
      ) {
        recommendations.push("Wait for person to move away");
        recommendations.push("Consider going out with someone");
      }

      if (detections.some((d) => d.type === "animal")) {
        recommendations.push("Carry an animal deterrent");
        recommendations.push("Move slowly and avoid direct eye contact");
      }

      if (scanMode === "night") {
        recommendations.push("Use a flashlight");
        recommendations.push("Stay in well-lit areas");
      }

      if (recommendations.length === 0) {
        recommendations.push(
          "Area appears clear. Proceed with normal caution.",
        );
      }

      return recommendations;
    },
    [scanMode],
  );

  const startScan = useCallback(() => {
    if (!webcamRef.current) {
      setCameraError("Camera not accessible. Please check permissions.");
      return;
    }

    setScanning(true);
    setScanStatus("scanning");
    setScanProgress(0);
    setCameraError(null);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          setScanning(false);
          setScanStatus("complete");
          setScanTime(new Date().toLocaleTimeString());

          // Mock AI analysis results
          const results = {
            timestamp: new Date().toISOString(),
            mode: scanMode,
            detections: mockDetections,
            overallSafety: calculateOverallSafety(mockDetections),
            recommendations: generateRecommendations(mockDetections),
          };

          if (onScanComplete) {
            onScanComplete(results);
          }

          return 100;
        }
        return prev + 10;
      });
    }, 200);
  }, [
    scanMode,
    onScanComplete,
    calculateOverallSafety,
    generateRecommendations,
  ]);

  const stopScan = () => {
    setScanning(false);
    setScanStatus("stopped");
    setScanProgress(0);
  };

  const getSafetyColor = (safetyLevel) => {
    switch (safetyLevel) {
      case "danger":
        return "error";
      case "caution":
        return "warning";
      case "safe":
        return "success";
      default:
        return "info";
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment",
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <SecurityIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" component="h2">
            Safety Scanner
          </Typography>
        </Box>

        {/* Camera Preview */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: "background.default" }}>
          <Box
            sx={{ position: "relative", borderRadius: 2, overflow: "hidden" }}
          >
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{ width: "100%", borderRadius: 8 }}
              onUserMediaError={() =>
                setCameraError(
                  "Failed to access camera. Please check permissions.",
                )
              }
            />

            {scanning && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <CircularProgress
                  size={80}
                  thickness={4}
                  sx={{ mb: 2, color: "primary.main" }}
                />
                <Typography variant="h6" color="white">
                  Scanning Environment...
                </Typography>
                <Typography variant="body2" color="white" sx={{ mt: 1 }}>
                  {scanProgress}% Complete
                </Typography>
              </Box>
            )}
          </Box>

          {cameraError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {cameraError}
            </Alert>
          )}

          {/* Scan Mode Toggle */}
          <Box
            sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}
          >
            <Tooltip title="Day Mode">
              <IconButton
                color={scanMode === "day" ? "primary" : "default"}
                onClick={() => setScanMode("day")}
                disabled={scanning}
              >
                <DayIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Night Mode (Enhanced detection)">
              <IconButton
                color={scanMode === "night" ? "primary" : "default"}
                onClick={() => setScanMode("night")}
                disabled={scanning}
              >
                <NightIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        {/* Scan Controls */}
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={scanning ? <StopIcon /> : <PlayIcon />}
              onClick={scanning ? stopScan : startScan}
              disabled={cameraError}
              sx={{ minWidth: 140 }}
            >
              {scanning ? "Stop Scan" : "Start Scan"}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="large"
              startIcon={<RefreshIcon />}
              onClick={() => {
                setScanStatus("ready");
                setScanProgress(0);
                setScanTime(null);
                if (onScanComplete) onScanComplete(null);
              }}
              disabled={scanning}
            >
              Reset
            </Button>
          </Grid>
        </Grid>

        {/* Scan Status */}
        {scanStatus !== "ready" && (
          <Box sx={{ mt: 3 }}>
            <Alert
              severity={getSafetyColor(
                scanStatus === "complete" ? "safe" : "info",
              )}
              icon={
                scanStatus === "complete" ? <SecurityIcon /> : <WarningIcon />
              }
            >
              <Typography variant="body1">
                {scanStatus === "scanning" && "Scanning in progress..."}
                {scanStatus === "complete" && `Scan completed at ${scanTime}`}
                {scanStatus === "stopped" && "Scan stopped"}
              </Typography>
            </Alert>
          </Box>
        )}

        {/* Quick Tips */}
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            💡 Scan Tips:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            1. Hold phone steady and rotate slowly
          </Typography>
          <Typography variant="body2" color="text.secondary">
            2. Scan from different angles if possible
          </Typography>
          <Typography variant="body2" color="text.secondary">
            3. Use night mode for low-light conditions
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SafetyScanner;
