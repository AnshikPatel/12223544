import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  Paper
} from "@mui/material";
import axios from "axios";
import { getAccessToken } from "../services/auth";
import { logEvent } from "../services/logger";
import { Link } from "react-router-dom";

const ShortenerPage = () => {
  const [urls, setUrls] = useState([{ longUrl: "", validity: "", shortcode: "" }]);
  const [results, setResults] = useState([]); // state for shortened links

  const handleInputChange = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const addUrlInput = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: "", validity: "", shortcode: "" }]);
    }
  };

  const handleSubmit = async () => {
    const errors = [];

    const preparedData = urls.map((entry, idx) => {
      const { longUrl, validity, shortcode } = entry;

      // Basic URL check
      try {
        new URL(longUrl);
      } catch {
        errors.push(`Row ${idx + 1}: Invalid URL`);
      }

      // Validity check
      let validityMinutes = 30;
      if (validity) {
        const minutes = parseInt(validity);
        if (isNaN(minutes) || minutes <= 0) {
          errors.push(`Row ${idx + 1}: Validity must be a positive number`);
        } else {
          validityMinutes = minutes;
        }
      }

      return {
        longUrl: longUrl.trim(),
        validityMinutes,
        shortcode: shortcode?.trim() || null
      };
    });

    if (errors.length) {
      alert(errors.join("\n"));
      return;
    }

    const token = await getAccessToken();

    if (!token) {
      alert("Unable to fetch access token");
      return;
    }

    await logEvent(token, "frontend", "info", "component", "Submitting URLs");

    for (let entry of preparedData) {
      try {
        const res = await axios.post(
          "http://20.244.56.144/url-shortener/shorten", // update if needed
          entry,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("Shortened:", res.data);
        setResults((prev) => [...prev, res.data]); //  store response

        await logEvent(token, "frontend", "info", "api", `Shortened URL: ${entry.longUrl}`);
      } catch (err) {
        console.error("API error:", err);
        await logEvent(token, "frontend", "error", "api", `Error shortening ${entry.longUrl}`);
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom mt={4}>
         URL Shortener
      </Typography>

      {urls.map((entry, idx) => (
        <Paper elevation={2} key={idx} style={{ padding: 16, marginBottom: 16 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Original Long URL"
                value={entry.longUrl}
                onChange={(e) => handleInputChange(idx, "longUrl", e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Optional Validity (minutes)"
                value={entry.validity}
                onChange={(e) => handleInputChange(idx, "validity", e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Optional Custom Shortcode"
                value={entry.shortcode}
                onChange={(e) => handleInputChange(idx, "shortcode", e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Box display="flex" justifyContent="space-between" mb={4}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
           Shorten URLs
        </Button>
        <Button
          variant="outlined"
          onClick={addUrlInput}
          disabled={urls.length >= 5}
        >
           Add More
        </Button>
      </Box>
      {/* //
      // */}
      <Button variant="text" component={Link} to="/stats">
   View Stats
</Button>

      {results.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
             Shortened URLs
          </Typography>
          {results.map((item, idx) => (
            <Paper key={idx} elevation={2} style={{ padding: 16, marginBottom: 16 }}>
              <Typography variant="body1">
                <strong>Short URL:</strong>{" "}
                <a
                  href={`http://localhost:3000/${item.shortcode}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  http://localhost:3000/{item.shortcode}
                </a>
              </Typography>
              <Typography variant="body2">
                <strong>Expires At:</strong> {new Date(item.expiryTime).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>Original URL:</strong> {item.originalUrl}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ShortenerPage;
