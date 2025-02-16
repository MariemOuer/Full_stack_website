const express = require("express");
const mysql = require("mysql2/promise");

const router = express.Router();

// Database Connection
const pool = mysql.createPool(process.env.MYSQL_AIVEN_URI);

// Route to Fetch Data from TEST Table
router.get("/db-test", async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Ensure the correct database is used
    await connection.query("USE OccasioDB;");

    // Fetch all rows from TEST table
    const [rows] = await connection.query("SELECT * FROM TEST;");
    
    connection.release();
    
    // Respond with only the data (no message field)
    res.json(rows);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

module.exports = router;
