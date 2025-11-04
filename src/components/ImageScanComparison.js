// components/ImageScanComparison.js
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Skeleton,
  Alert,
  Chip,
  Grid
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { fetchScansByPainting } from "../api/analyticsApi";
import "./ImageScanComparison.css";

export default function ImageScanComparison() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("descending");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchScansByPainting();

        if (!result || result.length === 0) {
          setError("No painting scan data available");
          setData([]);
          return;
        }

        // Transform data for better display
        const transformedData = result.map(item => ({
          _id: item._id || "Unknown",
          paintingName: item.paintingName || item._id,
          count: item.count || 0,
          lastScanned: item.lastScanned || null,
          percentage: 0 // Will calculate after sorting
        }));

        // Sort data
        const sortedData = [...transformedData].sort((a, b) => {
          return sortBy === "descending"
            ? b.count - a.count
            : a.count - b.count;
        });

        // Calculate percentages
        const totalScans = sortedData.reduce((sum, item) => sum + item.count, 0);
        sortedData.forEach(item => {
          item.percentage = ((item.count / totalScans) * 100).toFixed(1);
        });

        // Limit to top 10 for better visualization
        setData(sortedData.slice(0, 10));
      } catch (err) {
        setError(`Failed to load painting scans: ${err.message}`);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sortBy]);

  const handleSortToggle = () => {
    setSortBy(sortBy === "descending" ? "ascending" : "descending");
  };

  // Color palette for bars
  const getBarColor = (index) => {
    const colors = [
      "#6A1B9A",
      "#AB47BC",
      "#CE93D8",
      "#E1BEE7",
      "#FF6F00",
      "#FFB74D",
      "#2196F3",
      "#64B5F6",
      "#4CAF50",
      "#81C784"
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <Card className="comparison-card" elevation={2}>
        <CardHeader title="Compare Painting Scans" />
        <CardContent>
          <Skeleton variant="rectangular" height={300} />
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Skeleton variant="text" width="20%" />
            <Skeleton variant="text" width="20%" />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="comparison-card" elevation={2}>
        <CardHeader title="Compare Painting Scans" />
        <CardContent>
          <Alert severity="warning">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="comparison-card" elevation={2}>
        <CardHeader title="Compare Painting Scans" />
        <CardContent>
          <Alert severity="info">No scan data available yet</Alert>
        </CardContent>
      </Card>
    );
  }

  const totalScans = data.reduce((sum, item) => sum + item.count, 0);
  const topPainting = data[0];
  const avgScans = (totalScans / data.length).toFixed(1);

  return (
    <Card className="comparison-card" elevation={2}>
      <CardHeader
        title="Compare Painting Scans"
        titleTypographyProps={{ variant: "h6", sx: { color: "#6A1B9A", fontWeight: 600 } }}
        action={
          <Chip
            label={`Sort: ${sortBy}`}
            onClick={handleSortToggle}
            color="primary"
            variant="outlined"
            sx={{ cursor: "pointer" }}
          />
        }
      />

      <CardContent>
        {/* Stats Summary */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={4}>
            <Box className="stat-summary">
              <Typography variant="h6" sx={{ color: "#6A1B9A", fontWeight: 700 }}>
                {data.length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Paintings Scanned
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Box className="stat-summary">
              <Typography variant="h6" sx={{ color: "#AB47BC", fontWeight: 700 }}>
                {totalScans}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Total Scans
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Box className="stat-summary">
              <Typography variant="h6" sx={{ color: "#FF6F00", fontWeight: 700 }}>
                {avgScans}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Avg Per Painting
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="paintingName"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 11 }}
              interval={0}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "2px solid #6A1B9A",
                borderRadius: "8px",
                padding: "10px"
              }}
              cursor={{ fill: "rgba(106, 27, 154, 0.08)" }}
              formatter={(value, name) => {
                if (name === "count") return [value, "Scans"];
                return value;
              }}
              labelFormatter={(label) => `Painting: ${label}`}
            />
            <Legend />
            <Bar
              dataKey="count"
              name="Times Scanned"
              radius={[8, 8, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Top Painting Highlight */}
        {topPainting && (
          <Box className="top-painting-box" sx={{ mt: 3, p: 2 }}>
            <Typography variant="subtitle2" sx={{ color: "#6A1B9A", fontWeight: 600, mb: 1 }}>
              🏆 Most Scanned Painting
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2">
                <strong>{topPainting.paintingName}</strong>
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography variant="body2" sx={{ color: "#FF6F00", fontWeight: 600 }}>
                  {topPainting.count} scans ({topPainting.percentage}%)
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
