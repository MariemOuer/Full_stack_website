const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Import route modules
const emailRoutes = require("./routes/email");
const eventRoutes = require("./routes/event");
const invitesRoutes = require("./routes/invites");
const guestsRoutes = require("./routes/guests");
const suggestionsRoutes = require("./routes/suggestions");

// Mount routes (adjust paths as needed)
app.use("/api", emailRoutes);
app.use("/api", eventRoutes);
app.use("/api", invitesRoutes);
app.use("/api", guestsRoutes);
app.use("/api", suggestionsRoutes);

// A simple test route
app.get("/test", (req, res) => {
  res.status(200).json({ message: "Test route works!" });
});

module.exports = app;

/**
 * This is the main server file for the Occasio backend API, built using Express.
 * It initializes and configures the Express application, sets up middleware, 
 * and mounts the necessary API routes for handling various backend functionalities.
 * 
 * ## Configuration:
 * - `dotenv`: Loads environment variables from a `.env` file.
 * - `cors`: Enables Cross-Origin Resource Sharing (CORS) to allow requests from any origin.
 * - `express.json()`: Middleware to parse incoming JSON request bodies.
 * 
 * ## Route Modules:
 * - `/api/email` → Handles email-related actions (e.g., sending test emails).
 * - `/api/events` → Manages event creation, retrieval, and updates.
 * - `/api/invites` → Sends event invitations to guests via email.
 * - `/api/guests` → Handles guest-related operations (adding/removing guests).
 * - `/api/suggestions` → Uses AI to generate event planning recommendations.
 * 
 * ## Test Route:
 * - **GET `/test`** → Returns a simple JSON response `{ message: "Test route works!" }` to verify the server is running.
 * 
 * ## Server Initialization:
 * - Starts the Express server on the specified `PORT` (defaults to 3000 if not set in `.env`).
 * - Logs a confirmation message when the server is successfully running.
 * 
 * This server acts as the backend API for the Occasio event management system,
 * supporting event creation, guest management, invitation emails, and AI-driven suggestions.
 */

