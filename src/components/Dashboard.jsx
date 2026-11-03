import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Paper,
} from "@mui/material";
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Pets as AnimalIcon,
  DirectionsCar as VehicleIcon,
  Lightbulb as TipIcon,
  Timer as TimerIcon,
} from "@mui/icons-material";

const Dashboard = ({ scanResults }) => {
  // Default/empty state data
  const defaultResults = {
    overallSafety: "unknown",
    detections: [],
    recommendations: ["Run a scan to check safety"],
    timestamp: null,
    mode: "day",
  };

  const results = scanResults || defaultResults;

  const getSafetyColor = (safetyLevel) => {
    switch (safetyLevel) {
      case "danger":
        return "error.main";
      case "caution":
        return "warning.main";
      case "safe":
        return "success.main";
      case "unknown":
        return "text.secondary";
      default:
        return "info.main";
    }
  };

  const getSafetyIcon = (safetyLevel) => {
    switch (safetyLevel) {
      case "danger":
        return <WarningIcon />;
      case "caution":
        return <WarningIcon />;
      case "safe":
        return <CheckCircleIcon />;
      default:
        return <SecurityIcon />;
    }
  };

  const getSafetyLabel = (safetyLevel) => {
    switch (safetyLevel) {
      case "danger":
        return "High Risk - Stay Inside";
      case "caution":
        return "Medium Risk - Be Cautious";
      case "safe":
        return "Low Risk - Proceed Safely";
      case "unknown":
        return "Scan Required";
      default:
        return "Unknown Status";
    }
  };

  const getThreatIcon = (type) => {
    switch (type) {
      case "person":
        return <PersonIcon />;
      case "animal":
        return <AnimalIcon />;
      case "vehicle":
        return <VehicleIcon />;
      default:
        return <WarningIcon />;
    }
  };

  const getThreatColor = (threatLevel) => {
    switch (threatLevel) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <SecurityIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" component="h2">
            Safety Analysis
          </Typography>
        </Box>

        {/* Overall Safety Status */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            bgcolor: getSafetyColor(results.overallSafety),
            color: "white",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          >
            {getSafetyIcon(results.overallSafety)}
            <Typography
              variant="h4"
              component="div"
              sx={{ ml: 1, fontWeight: "bold" }}
            >
              {getSafetyLabel(results.overallSafety)}
            </Typography>
          </Box>

          {results.timestamp && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 1,
              }}
            >
              <TimerIcon sx={{ mr: 0.5, fontSize: 16 }} />
              <Typography variant="caption">
                Last scan: {new Date(results.timestamp).toLocaleTimeString()}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Detected Objects */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <WarningIcon sx={{ mr: 1 }} />
            Detected Objects
          </Typography>

          {results.detections.length > 0 ? (
            <Grid container spacing={2}>
              {results.detections.map((detection, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper sx={{ p: 2, height: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      {getThreatIcon(detection.type)}
                      <Typography
                        variant="subtitle2"
                        sx={{ ml: 1, textTransform: "capitalize" }}
                      >
                        {detection.type}
                      </Typography>
                    </Box>

                    <Chip
                      label={`${detection.threatLevel} threat`}
                      size="small"
                      color={getThreatColor(detection.threatLevel)}
                      sx={{ mb: 1 }}
                    />

                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Confidence: {detection.confidence}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={detection.confidence}
                        color={
                          detection.confidence > 80
                            ? "success"
                            : detection.confidence > 60
                              ? "warning"
                              : "error"
                        }
                        sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                      />
                    </Box>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Distance: {detection.distance}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">
              No objects detected. Run a scan to check your surroundings.
            </Alert>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Safety Recommendations */}
        <Box>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <TipIcon sx={{ mr: 1 }} />
            Safety Recommendations
          </Typography>

          <List dense>
            {results.recommendations.map((recommendation, index) => (
              <ListItem key={index} sx={{ pl: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <TipIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={recommendation}
                  primaryTypographyProps={{ variant: "body2" }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Quick Safety Actions:
          </Typography>
          <Grid container spacing={1}>
            <Grid item>
              <Chip
                icon={<TimerIcon />}
                label="Set Safety Timer"
                variant="outlined"
                size="small"
                onClick={() => alert("Timer feature coming soon!")}
              />
            </Grid>
            <Grid item>
              <Chip
                icon={<PersonIcon />}
                label="Share Location"
                variant="outlined"
                size="small"
                onClick={() => alert("Location sharing coming soon!")}
              />
            </Grid>
            <Grid item>
              <Chip
                icon={<WarningIcon />}
                label="Emergency Alert"
                variant="outlined"
                size="small"
                color="error"
                onClick={() => alert("Emergency feature coming soon!")}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Scan Mode Info */}
        {results.mode && (
          <Box sx={{ mt: 2 }}>
            <Chip
              label={`${results.mode === "night" ? "🌙 Night Mode" : "☀️ Day Mode"} Active`}
              size="small"
              variant="outlined"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;
