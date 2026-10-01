const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    message: "LabTrack Backend API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "LabTrack backend is connected",
  });
});

app.listen(PORT, () => {
  console.log(`LabTrack backend running on http://localhost:${PORT}`);
});