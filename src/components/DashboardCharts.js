import React from "react";
import { Card, CardContent, CardHeader, Typography, Box, Grid } from "@mui/material";
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import "./DashboardCharts.css";

// Helper function to bucket scans by time interval (hour)
function scansOverTime(events, intervalMinutes = 60) {
  if (!events || events.length === 0) return [];

  // Sort events by timestamp
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  const bucketed = {};

  sortedEvents.forEach(event => {
    const date = new Date(event.timestamp);
    // Round down to nearest interval
    const floorMinutes = Math.floor(date.getMinutes() / intervalMinutes) * intervalMinutes;
    const bucketKey = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), floorMinutes);
    const bucketLabel = bucketKey.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });

    if (!bucketed[bucketLabel]) {
      bucketed[bucketLabel] = { 
        time: bucketLabel, 
        total: 0, 
        image: 0, 
        qr: 0,
        timestamp: bucketKey.getTime()
      };
    }

    bucketed[bucketLabel].total += 1;
    if (event.scanType === "image") {
      bucketed[bucketLabel].image += 1;
    } else if (event.scanType === "qr") {
      bucketed[bucketLabel].qr += 1;
    }
  });

  // Sort by timestamp and return as array
  return Object.values(bucketed).sort((a, b) => a.timestamp - b.timestamp);
}

export default function DashboardCharts({ events }) {
  // Prepare pie chart data
  const pieData = [
    { name: "Image Scan", value: events.filter(e => e.scanType === "image").length },
    { name: "QR Code Scan", value: events.filter(e => e.scanType === "qr").length }
  ];

  // Prepare line chart data
  const lineData = scansOverTime(events, 60);

  const COLORS = ["#6A1B9A", "#AB47BC"];
  const LINE_COLORS = { image: "#6A1B9A", qr: "#FF6F00" };

  return (
    <Box className="charts-container">
      <Grid container spacing={3}>
        {/* Pie Chart - Scan Types Breakdown */}
        <Grid item xs={12} md={6}>
          <Card className="chart-card" elevation={2}>
            <CardHeader
              title="Scans Breakdown by Type"
              titleTypographyProps={{ variant: "h6", sx: { color: "#6A1B9A", fontWeight: 600 } }}
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#8884d8"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#fff", 
                      border: "1px solid #6A1B9A",
                      borderRadius: "8px"
                    }} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Line Chart - Scans Over Time */}
        <Grid item xs={12} md={6}>
          <Card className="chart-card" elevation={2}>
            <CardHeader
              title="Scans Over Time"
              titleTypographyProps={{ variant: "h6", sx: { color: "#6A1B9A", fontWeight: 600 } }}
            />
            <CardContent>
              {lineData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineData} margin={{ top: 5, right: 30, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="time" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#fff", 
                        border: "1px solid #6A1B9A",
                        borderRadius: "8px"
                      }}
                      formatter={(value) => [value, "Scans"]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#6A1B9A" 
                      strokeWidth={2}
                      dot={{ fill: "#6A1B9A", r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Total Scans"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="image" 
                      stroke="#AB47BC" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "#AB47BC", r: 3 }}
                      name="Image Scans"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="qr" 
                      stroke="#FF6F00" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "#FF6F00", r: 3 }}
                      name="QR Scans"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
                  <Typography variant="body2" color="textSecondary">
                    No scan data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Stats */}
        <Grid item xs={12}>
          <Card className="chart-card stats-card" elevation={2}>
            <CardHeader
              title="Quick Stats"
              titleTypographyProps={{ variant: "h6", sx: { color: "#6A1B9A", fontWeight: 600 } }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box className="stat-box">
                    <Typography variant="h4" sx={{ color: "#6A1B9A", fontWeight: 700 }}>
                      {events.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">Total Scans</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box className="stat-box">
                    <Typography variant="h4" sx={{ color: "#AB47BC", fontWeight: 700 }}>
                      {events.filter(e => e.scanType === "image").length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">Image Scans</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box className="stat-box">
                    <Typography variant="h4" sx={{ color: "#FF6F00", fontWeight: 700 }}>
                      {events.filter(e => e.scanType === "qr").length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">QR Scans</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box className="stat-box">
                    <Typography variant="h4" sx={{ color: "#4CAF50", fontWeight: 700 }}>
                      {events.length > 0 ? lineData.length : 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">Time Buckets</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
