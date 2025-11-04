import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Container, Paper } from "@mui/material";
import PaintingStats from "../components/PaintingStats";
import DashboardCharts from "../components/DashboardCharts";
import TopScannedPaintings from "../components/TopScannedPaintings";
import ImageScanComparison from "../components/ImageScanComparison";
import { fetchAnalyticsEvents, fetchSummary } from "../api/analyticsApi";
import "./DashboardPage.css";

export default function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [eventsData, summaryData] = await Promise.all([
          fetchAnalyticsEvents(),
          fetchSummary()
        ]);
        setEvents(eventsData || []);
        setSummary(summaryData || []);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <Box className="dashboard-wrapper">
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box className="dashboard-header" sx={{ py: 4, mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: "#6A1B9A",
              fontWeight: 700,
              letterSpacing: 1.5,
              mb: 1,
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)"
            }}
          >
            analytics Dashboard
          </Typography>
          <Box
            sx={{
              height: "4px",
              width: "80px",
              background: "linear-gradient(90deg, #6A1B9A, #AB47BC)",
              borderRadius: "2px"
            }}
          />
        </Box>

        {/* Main Grid Layout */}
        <Grid container spacing={3}>
          {/* Row 1: Stats Cards (Left) + Summary Charts (Right) */}
          <Grid item xs={12} lg={4}>
            <Paper className="dashboard-card" elevation={3}>
              <PaintingStats events={events} />
            </Paper>
          </Grid>

          <Grid item xs={12} lg={8}>
            <Paper className="dashboard-card" elevation={3}>
              <DashboardCharts events={events} />
            </Paper>
          </Grid>

          {/* Row 2: Top Scanned Paintings + Comparison Chart */}
          <Grid item xs={12} md={6}>
            <Paper className="dashboard-card" elevation={3}>
              <TopScannedPaintings summary={summary} loading={loading} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper className="dashboard-card" elevation={3}>
              <ImageScanComparison />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
