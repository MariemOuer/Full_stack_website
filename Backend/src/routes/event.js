const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Create an event with default guests
router.post("/save-event", (req, res) => {
  const {
    user_email,
    event_name,
    event_type,
    event_date,
    event_length,
    guest_count,
    location,
    catering,
    theme,
    entertainment,
    budget,
    accommodations,
    special_requests,
    event_timeline,
  } = req.body;

  const query = `
    INSERT INTO event_responses 
    (user_email, event_name, event_type, event_date, event_length, guest_count, location, catering, 
     theme, entertainment, budget, accommodations, special_requests, event_timeline)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    user_email,
    event_name,
    event_type,
    event_date,
    event_length,
    guest_count,
    location,
    catering,
    theme,
    entertainment,
    budget,
    accommodations,
    special_requests,
    JSON.stringify(event_timeline),
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error saving event:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const eventId = result.insertId;
    const guestQuery = `
      INSERT INTO guests (event_id, name, email, status) 
      VALUES 
        (?, 'Guest 1', 'guest1@example.com', 'Pending'),
        (?, 'Guest 2', 'guest2@example.com', 'Pending'),
        (?, 'Guest 3', 'guest3@example.com', 'Pending')
    `;

    db.query(guestQuery, [eventId, eventId, eventId], (guestErr) => {
      if (guestErr) {
        console.error("Error creating default guests:", guestErr);
        return res.status(500).json({ message: "Event saved, but guests not created" });
      }
      res.status(200).json({ message: "Event and guests created successfully!" });
    });
  });
});

// Get all events
router.get("/events", (req, res) => {
  db.query("SELECT * FROM event_responses", (err, results) => {
    if (err) {
      console.error("Error fetching events:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ events: results });
  });
});

// Get a specific event
router.get("/event/:eventId", (req, res) => {
  const { eventId } = req.params;
  db.query("SELECT * FROM event_responses WHERE id = ?", [eventId], (err, result) => {
    if (err) {
      console.error("Error fetching event:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(result[0]);
  });
});

// Get all guests for an event
router.get("/event/:eventId/guests", (req, res) => {
  const { eventId } = req.params;
  db.query("SELECT * FROM guests WHERE event_id = ?", [eventId], (err, results) => {
    if (err) {
      console.error("Error fetching guests:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
});

// Add a guest to an event
router.post("/event/:eventId/add-guest", (req, res) => {
  const { eventId } = req.params;
  const { name, email, phone, status } = req.body;

  const query = `
    INSERT INTO guests (event_id, name, email, phone, status) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [eventId, name, email, phone, status || "Pending"], (err) => {
    if (err) {
      console.error("Error adding guest:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ message: "Guest added successfully!" });
  });
});

// ✅ Cleanup guest session data before starting fresh
router.post("/cleanup-guest", async (req, res) => {
    const guestIdentifier = "Guest"; // <- matches user_email in your DB
  
    try {
      // 1. Delete guests linked to guest-created events
      await db.promise().query(
        `DELETE FROM guests 
         WHERE event_id IN (
           SELECT id FROM event_responses WHERE user_email = ?
         )`,
        [guestIdentifier]
      );
  
      // 2. Delete guest-created events
      await db.promise().query(
        `DELETE FROM event_responses WHERE user_email = ?`,
        [guestIdentifier]
      );
  
      res.status(200).json({ message: "Guest session cleaned successfully." });
    } catch (err) {
      console.error("❌ Error cleaning guest session:", err);
      res.status(500).json({ message: "Failed to reset guest session." });
    }
  });
  

module.exports = router;


/**
 * This module defines the API routes for managing events and guests in the Occasio event management system.
 * It uses an Express Router to modularize the routes related to event creation, retrieval, and guest management.
 * 
 * The routes include:
 * 
 * 1. Creating an Event with Default Guests:
 *    - **POST /save-event:**  
 *      Accepts event details (such as user email, event name, type, date, length, guest count, location,
 *      catering, theme, entertainment, budget, accommodations, special requests, and event timeline) via the request body.
 *      It inserts a new event into the `event_responses` table and then creates three default guest entries in the `guests` table.
 *      If any error occurs during the process, it responds with a corresponding HTTP status and error message.
 * 
 * 2. Retrieving Events:
 *    - **GET /events:**  
 *      Retrieves all events stored in the `event_responses` table and returns them as a JSON response.
 * 
 *    - **GET /event/:eventId:**  
 *      Retrieves the details of a specific event based on its `eventId` parameter.
 *      If the event is not found, it returns a 404 status with a relevant message.
 * 
 * 3. Managing Guests for an Event:
 *    - **GET /event/:eventId/guests:**  
 *      Retrieves all guests associated with a particular event using the event's ID.
 * 
 *    - **POST /event/:eventId/add-guest:**  
 *      Adds a new guest to the specified event by inserting guest details (name, email, phone, and status)
 *      into the `guests` table. The status defaults to "Pending" if not provided.
 * 
 * The module utilizes a MySQL connection (imported from `../config/db`) to perform the necessary database operations.
 * For each database query, errors are logged and an appropriate HTTP error response is sent back to the client.
 * 
 * Finally, the configured router is exported to be mounted in the main application.
 */
