import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  Box,
  LinearProgress,
  Grid,
  Chip,
  Alert
} from "@mui/material";
import "./PaintingStats.css";

export default function PaintingStats({ events }) {
  const stats = useMemo(() => {
    if (!events || events.length === 0) {
      return {
        totalScans: 0,
        totalImage: 0,
        totalQR: 0,
        audioPlays: 0,
        fails: 0,
        successRate: 0,
        failureRate: 0
      };
    }

    const totalScans = events.filter(e => e.eventType === "scan_success").length;
    const totalQR = events.filter(
      e => e.eventType === "scan_success" && e.scanType === "qr"
    ).length;
    const totalImage = events.filter(
      e => e.eventType === "scan_success" && e.scanType === "image"
    ).length;
    const audioPlays = events.filter(
      e => e.eventType === "play_audio_guide"
    ).length;
    const fails = events.filter(e => e.eventType === "scan_fail").length;

    const totalAttempts = totalScans + fails;
    const successRate =
      totalAttempts > 0
        ? Math.round((totalScans / totalAttempts) * 100)
        : 0;
    const failureRate = 100 - successRate;

    return {
      totalScans,
      totalImage,
      totalQR,
      audioPlays,
      fails,
      successRate,
      failureRate,
      totalAttempts
    };
  }, [events]);

  const StatItem = ({ icon, label, value, color, progress, unit = "" }) => (
    <Box className="stat-item">
      <Box className="stat-header">
        <Box className="stat-icon" sx={{ background: color }}>
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" className="stat-label">
            {label}
          </Typography>
          <Typography variant="h5" className="stat-value" sx={{ color }}>
            {value}
            {unit && <span className="stat-unit">{unit}</span>}
          </Typography>
        </Box>
      </Box>
      {progress !== undefined && (
        <LinearProgress
          variant="determinate"
          value={progress}
          className="stat-progress"
          sx={{
            height: "6px",
            borderRadius: "3px",
            backgroundColor: "rgba(0, 0, 0, 0.08)",
            "& .MuiLinearProgress-bar": {
              backgroundColor: color,
              borderRadius: "3px"
            }
          }}
        />
      )}
    </Box>
  );

  if (!events || events.length === 0) {
    return (
      <Card className="stats-card" elevation={2}>
        <CardHeader
          title="Summary Stats"
          titleTypographyProps={{
            variant: "h6",
            sx: { color: "#6A1B9A", fontWeight: 600 }
          }}
        />
        <CardContent>
          <Alert severity="info">No scan data available yet</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="stats-card" elevation={2}>
      <CardHeader
        title="Summary Stats"
        titleTypographyProps={{
          variant: "h6",
          sx: { color: "#6A1B9A", fontWeight: 600 }
        }}
        action={
          <Chip
            label={`${stats.successRate}% Success`}
            size="small"
            color={stats.successRate >= 80 ? "success" : "warning"}
            variant="outlined"
          />
        }
      />

      <CardContent>
        <Stack spacing={2.5}>
          {/* Main Statistics */}
          <Box className="stats-grid">
            <StatItem
              icon="🖼️"
              label="Total Scans"
              value={stats.totalScans}
              color="#6A1B9A"
              progress={(stats.totalScans / Math.max(stats.totalAttempts, 1)) * 100}
            />
            <StatItem
              icon="📷"
              label="Image Scans"
              value={stats.totalImage}
              color="#AB47BC"
              progress={
                stats.totalScans > 0
                  ? (stats.totalImage / stats.totalScans) * 100
                  : 0
              }
            />
            <StatItem
              icon="📱"
              label="QR Scans"
              value={stats.totalQR}
              color="#FF6F00"
              progress={
                stats.totalScans > 0
                  ? (stats.totalQR / stats.totalScans) * 100
                  : 0
              }
            />
            <StatItem
              icon="🔈"
              label="Audio Guides"
              value={stats.audioPlays}
              color="#2196F3"
            />
          </Box>

          {/* Divider */}
          <Box sx={{ height: "1px", backgroundColor: "#e0e0e0" }} />

          {/* Success/Failure Breakdown */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1.5, fontWeight: 600, color: "#333" }}
            >
              Success Rate Breakdown
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <Box className="breakdown-item success">
                  <Typography variant="h6" sx={{ color: "#4CAF50" }}>
                    {stats.successRate}%
                  </Typography>
                  <Typography variant="caption">Successful</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={stats.successRate}
                    sx={{
                      mt: 1,
                      height: "4px",
                      backgroundColor: "rgba(76, 175, 80, 0.2)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#4CAF50"
                      }
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className="breakdown-item error">
                  <Typography variant="h6" sx={{ color: "#F44336" }}>
                    {stats.failureRate}%
                  </Typography>
                  <Typography variant="caption">Failed ({stats.fails})</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={stats.failureRate}
                    sx={{
                      mt: 1,
                      height: "4px",
                      backgroundColor: "rgba(244, 67, 54, 0.2)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#F44336"
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Performance Summary */}
          <Box className="performance-summary">
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 600, color: "#333" }}
            >
              📊 Performance Summary
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box className="summary-item">
                  <Typography variant="caption" color="textSecondary">
                    Avg Scans/Min
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {(stats.totalAttempts / Math.max(events.length / 60, 1)).toFixed(1)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className="summary-item">
                  <Typography variant="caption" color="textSecondary">
                    Image/QR Ratio
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {stats.totalQR > 0
                      ? (stats.totalImage / stats.totalQR).toFixed(2)
                      : "N/A"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className="summary-item">
                  <Typography variant="caption" color="textSecondary">
                    Total Attempts
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {stats.totalAttempts}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className="summary-item">
                  <Typography variant="caption" color="textSecondary">
                    Audio Plays
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {stats.audioPlays}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
