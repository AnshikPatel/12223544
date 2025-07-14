import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import axios from "axios";
import { getAccessToken } from "../services/auth";
import { logEvent } from "../services/logger";

const StatsPage = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const token = await getAccessToken();
      if (!token) return;

      await logEvent(token, "frontend", "info", "page", "Fetching Stats");

      try {
        const res = await axios.get("http://20.244.56.144/url-shortener/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data); // adjust if your API sends a different shape
      } catch (err) {
        console.error("Stats API error:", err);
        await logEvent(token, "frontend", "error", "api", "Error fetching stats");
      }
    };

    fetchStats();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom mt={4}>
        📈 URL Shortener Stats
      </Typography>

      {stats.length === 0 ? (
        <Typography>No data available yet.</Typography>
      ) : (
        stats.map((item, idx) => (
          <Paper key={idx} elevation={3} style={{ padding: 16, marginBottom: 24 }}>
            <Typography variant="h6">
              🔗 Short URL: <a href={`/${item.shortcode}`}>/{item.shortcode}</a>
            </Typography>
            <Typography>Original URL: {item.originalUrl}</Typography>
            <Typography>Created At: {new Date(item.createdAt).toLocaleString()}</Typography>
            <Typography>Expires At: {new Date(item.expiryTime).toLocaleString()}</Typography>
            <Typography>Total Clicks: {item.clicks?.length || 0}</Typography>
            <Divider style={{ margin: "12px 0" }} />
            {item.clicks?.map((click, i) => (
              <Box key={i} style={{ marginBottom: 8 }}>
                <Typography variant="body2">📅 {new Date(click.timestamp).toLocaleString()}</Typography>
                <Typography variant="body2">🌍 Location: {click.location || "Unknown"}</Typography>
                <Typography variant="body2">🔗 Source: {click.source || "Direct"}</Typography>
              </Box>
            ))}
          </Paper>
        ))
      )}
    </Container>
  );
};

export default StatsPage;
