import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Typography,
  Box,
  LinearProgress,
  Skeleton,
  Alert,
  Chip
} from "@mui/material";
import "./TopScannedPaintings.css";

export default function TopScannedPaintings({ summary, loading = false }) {
  // Get max count for percentage calculation
  const maxCount = summary.length > 0 ? Math.max(...summary.map(p => p.count)) : 0;

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `#${rank + 1}`;
    }
  };

  const getMedalColor = (rank) => {
    switch (rank) {
      case 0:
        return "#FFD700"; // Gold
      case 1:
        return "#C0C0C0"; // Silver
      case 2:
        return "#CD7F32"; // Bronze
      default:
        return "#6A1B9A"; // Purple
    }
  };

  const getRankBadgeStyles = (rank) => {
    const colors = {
      0: { bg: "linear-gradient(135deg, #FFD700 0%, #FFC700 100%)", text: "#333" },
      1: { bg: "linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 100%)", text: "#333" },
      2: { bg: "linear-gradient(135deg, #CD7F32 0%, #B87333 100%)", text: "white" },
      default: {
        bg: "linear-gradient(135deg, #6A1B9A 0%, #AB47BC 100%)",
        text: "white"
      }
    };
    return colors[rank] || colors.default;
  };

  if (loading) {
    return (
      <Card className="paintings-card" elevation={2}>
        <CardHeader
          title="🏆 Most Scanned Paintings"
          titleTypographyProps={{
            variant: "h6",
            sx: { color: "#6A1B9A", fontWeight: 600 }
          }}
        />
        <CardContent>
          <List>
            {[...Array(5)].map((_, i) => (
              <ListItem key={i}>
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton variant="text" width="60%" />}
                  secondary={<Skeleton variant="text" width="40%" />}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  }

  if (!summary || summary.length === 0) {
    return (
      <Card className="paintings-card" elevation={2}>
        <CardHeader
          title="🏆 Most Scanned Paintings"
          titleTypographyProps={{
            variant: "h6",
            sx: { color: "#6A1B9A", fontWeight: 600 }
          }}
        />
        <CardContent>
          <Alert severity="info">No scanning data available yet</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="paintings-card" elevation={2}>
      <CardHeader
        title="🏆 Most Scanned Paintings"
        titleTypographyProps={{
          variant: "h6",
          sx: { color: "#6A1B9A", fontWeight: 600 }
        }}
        action={
          <Chip
            label={`${summary.length} Total`}
            size="small"
            variant="outlined"
            color="primary"
          />
        }
      />

      <CardContent>
        <List className="paintings-list" disablePadding>
          {summary.map((painting, index) => {
            const percentage = (painting.count / maxCount) * 100;
            const badgeStyles = getRankBadgeStyles(index);

            return (
              <ListItem
                key={painting._id}
                className={`painting-item rank-${index}`}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: "#fafafa",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                    boxShadow: "0 4px 12px rgba(106, 27, 154, 0.1)",
                    transform: "translateY(-2px)"
                  }
                }}
              >
                {/* Rank Badge */}
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      background: badgeStyles.bg,
                      color: badgeStyles.text,
                      fontWeight: 700,
                      fontSize: index < 3 ? "1.2rem" : "0.9rem",
                      width: 48,
                      height: 48,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
                    }}
                  >
                    {getMedalIcon(index)}
                  </Avatar>
                </ListItemAvatar>

                {/* Painting Details */}
                <Box sx={{ flex: 1, ml: 2 }}>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "#333",
                          mb: 0.5
                        }}
                      >
                        {painting._id || "Unknown Painting"}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography
                          variant="caption"
                          sx={{ display: "block", color: "#666", mb: 0.8 }}
                        >
                          {painting.count} scans
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          className="scan-progress"
                          sx={{
                            height: "6px",
                            borderRadius: "3px",
                            backgroundColor: "rgba(106, 27, 154, 0.1)",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor:
                                index === 0
                                  ? "#FFD700"
                                  : index === 1
                                  ? "#C0C0C0"
                                  : index === 2
                                  ? "#CD7F32"
                                  : "#6A1B9A",
                              borderRadius: "3px"
                            }
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 0.5
                          }}
                        >
                          <Typography variant="caption" sx={{ color: "#999" }}>
                            {percentage.toFixed(1)}% of max
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#6A1B9A", fontWeight: 600 }}
                          >
                            #{index + 1}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Box>

                {/* Scan Count Badge */}
                <Badge
                  badgeContent={painting.count}
                  color="primary"
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#6A1B9A",
                      color: "white",
                      fontSize: "0.75rem",
                      height: "24px",
                      minWidth: "24px",
                      borderRadius: "12px",
                      fontWeight: 700
                    }
                  }}
                >
                  <Box sx={{ width: "20px", height: "20px" }} />
                </Badge>
              </ListItem>
            );
          })}
        </List>

        {/* Summary Footer */}
        {summary.length > 0 && (
          <Box className="paintings-footer" sx={{ mt: 3, pt: 2, borderTop: "1px solid #e0e0e0" }}>
            <Typography variant="caption" color="textSecondary">
              Total Paintings Scanned: <strong>{summary.length}</strong>
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ display: "block", mt: 0.5 }}>
              Combined Scans: <strong>{summary.reduce((sum, p) => sum + p.count, 0)}</strong>
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
