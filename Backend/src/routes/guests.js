const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.delete("/guests/:guestId", (req, res) => {
  const { guestId } = req.params;
  db.query("DELETE FROM guests WHERE id = ?", [guestId], (err) => {
    if (err) {
      console.error("Error removing guest:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ message: "Guest removed successfully!" });
  });
});

module.exports = router;

/**
 * This module defines the API route for deleting a guest from the database.
 * It provides an Express route that allows for the removal of a guest 
 * by their unique ID.
 * 
 * Route:
 * - **DELETE /guests/:guestId**  
 *   - Deletes a guest record from the `guests` table using the provided `guestId`.
 *   - If an error occurs during the database operation, it logs the error and 
 *     returns a `500` status with a "Database error" message.
 *   - If the deletion is successful, it responds with a `200` status and a 
 *     confirmation message: "Guest removed successfully!"
 * 
 * The module utilizes MySQL (imported from `../config/db`) to execute the SQL 
 * DELETE query. This route is useful for managing guest lists by removing 
 * unwanted or outdated guest entries.
 * 
 * Finally, the configured router is exported for use in the main application.
 */
