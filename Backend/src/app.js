const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const testRoutes = require("./routes/test");
app.use("/api", testRoutes);

module.exports = app;
