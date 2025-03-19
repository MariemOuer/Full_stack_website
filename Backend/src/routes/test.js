const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();

// MySQL connection
const db = mysql.createConnection({
  host: "occasio-ocassio.e.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_hfdouDN5amzzSpdlppb",
  database: "OccasioDB",
  port: 25048,
  ssl: { rejectUnauthorized: false }, // Fixes SSL error
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log(" Connected to MySQL Database!");
});

//  Nodemailer Mail Server Configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "occasio401@gmail.com", // Hardcoded Email
    pass: "lgtf dlro ilxn zuja", // Hardcoded Gmail App Password
  },
});

//  Send Email Function (Updated to Support HTML Emails)
const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"Occasio Events" <occasio401@gmail.com>`,
      to,
      subject,
      html: htmlContent, // Use `html` instead of `text` to send formatted emails
    });
    console.log(` Email sent to ${to}`);
  } catch (error) {
    console.error(` Error sending email to ${to}:`, error);
  }
};


// Test Email Route
router.get("/send-test-email", async (req, res) => {
  try {
    const testRecipient = "mariemouertatani2001@gmail.com";
    const subject = "🎉 Test Email from Occasio!";
    const message = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hi there,</h2>
        <p>This is a test email from Occasio's event management system.</p>
        <p>If you received this email, the SMTP server is working correctly! 🎯</p>
        <br />
        <p>Regards,</p>
        <p><strong>Occasio Team</strong></p>
      </div>
    `;

    //  Use the sendEmail function with HTML support
    await sendEmail(testRecipient, subject, message);

    res.status(200).json({ message: `Test email sent to ${testRecipient}` });
  } catch (error) {
    console.error(" Error sending test email:", error);
    res.status(500).json({ message: " Failed to send test email" });
  }
});

//  Send Invitations to All Guests of an Event
router.post("/event/:eventId/send-invites", async (req, res) => {
  const { eventId } = req.params;
  const { style } = req.body; // Get the invitation style from request

  try {
    const [guests] = await db
      .promise()
      .query("SELECT email, name FROM guests WHERE event_id = ?", [eventId]);

    if (!guests.length) {
      return res
        .status(404)
        .json({ message: "No guests found for this event" });
    }

    const [eventResult] = await db
      .promise()
      .query("SELECT * FROM event_responses WHERE id = ?", [eventId]);

    if (!eventResult.length) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = eventResult[0];

    //  Generate email content based on the selected style
    const subject = `Invitation to ${event.event_name || "Our Special Event"}`;
    let message = "";

    switch (style) {
      case "whimsical":
        message = `
          <div style="font-family: 'Times New Roman', serif; background-color: #fefdf6; padding: 20px; border-radius: 8px;">
            <h1 style="color: #6c5a51;">✨ You're Invited to a Magical Celebration! ✨</h1>
            <p>🌸 Join us for <strong>${
              event.event_name || "a special event"
            }</strong></p>
            <p>📅 Date: ${event.event_date || "TBD"}</p>
            <p>📍 Location: ${event.location || "TBD"}</p>
            <p>🎭 Theme: ${event.theme || "A wonderful surprise!"}</p>
            <a href="#" style="display: inline-block; background-color: #bea490; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">🎟️ RSVP Now</a>
          </div>
        `;
        break;

      case "classic":
        message = `
          <div style="font-family: 'Georgia', serif; background-color: #fff7f3; padding: 20px; border-radius: 8px;">
            <h1 style="color: #5e4a4a;">💌 You're Invited!</h1>
            <p>🎊 Celebrate <strong>${
              event.event_name || "this special occasion"
            }</strong></p>
            <p>📅 Date: ${event.event_date || "TBD"}</p>
            <p>📍 Location: ${event.location || "TBD"}</p>
            <a href="#" style="display: inline-block; background-color: #d16a6a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">🎟️ RSVP Now</a>
          </div>
        `;
        break;

      case "professional":
        message = `
          <div style="font-family: 'Arial', sans-serif; background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <h1 style="color: #333;">📢 Join Us for a Professional Gathering</h1>
            <p><strong>${event.event_name || "Business Event"}</strong></p>
            <p>📅 Date: ${event.event_date || "TBD"}</p>
            <p>📍 Location: ${event.location || "TBD"}</p>
            <a href="#" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">📩 RSVP Here</a>
          </div>
        `;
        break;

      case "fun":
        message = `
          <div style="font-family: 'Poppins', Arial, sans-serif; background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <h1 style="color: #007bff;">🎉 Party Time! 🎉</h1>
            <p>🥳 Let's have fun at <strong>${
              event.event_name || "an amazing event"
            }</strong></p>
            <p>📅 Date: ${event.event_date || "TBD"}</p>
            <a href="#" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">🎟️ RSVP Now</a>
          </div>
        `;
        break;

      default:
        return res.status(400).json({ message: "Invalid invitation style" });
    }

    //  Send Emails
    for (const guest of guests) {
      await sendEmail(guest.email, subject, message);
      await db
        .promise()
        .query("UPDATE guests SET status = 'Email Sent!' WHERE email = ?", [
          guest.email,
        ]);
    }

    res.status(200).json({ message: "Invitations sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending invites:", error);
    res.status(500).json({ message: "Error sending invitations" });
  }
});

/** -----------------------  EVENT & GUEST ROUTES ----------------------- **/


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
      console.error(" Error saving event:", err);
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
        console.error(" Error creating default guests:", guestErr);
        return res
          .status(500)
          .json({ message: "Event saved, but guests not created" });
      }
      res
        .status(200)
        .json({ message: " Event and guests created successfully!" });
    });
  });
});

//  Get all saved events
router.get("/events", (req, res) => {
  db.query("SELECT * FROM event_responses", (err, results) => {
    if (err) {
      console.error("Error fetching events:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ events: results });
  });
});

//  Get specific event details
router.get("/event/:eventId", (req, res) => {
  const { eventId } = req.params;
  db.query(
    "SELECT * FROM event_responses WHERE id = ?",
    [eventId],
    (err, result) => {
      if (err) {
        console.error(" Error fetching event:", err);
        return res.status(500).json({ message: "Database error" });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json(result[0]);
    }
  );
});

//  Get all guests for an event
router.get("/event/:eventId/guests", (req, res) => {
  const { eventId } = req.params;
  db.query(
    "SELECT * FROM guests WHERE event_id = ?",
    [eventId],
    (err, results) => {
      if (err) {
        console.error(" Error fetching guests:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json(results);
    }
  );
});

// Route to Generate Suggestions Using OpenRouter AI
router.post("/suggestions", async (req, res) => {
  try {
    const { context, question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    console.log(`[${new Date().toISOString()}] POST /suggestions`);
    console.log("Request body:", req.body);

    const prompt = `You are an event planning assistant. Based on the following details:
${context}

and the question:
${question}

Please provide exactly 3 suggestions in the following format:
- Option 1: [suggestion]
- Option 2: [suggestion]
- Option 3: [suggestion]`;

    console.log("Constructed prompt:", prompt);

    const OPENROUTER_API_KEY =
      "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"; // Hardcoded API Key

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "rekaai/reka-flash-3:free",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("AI API response:", JSON.stringify(response.data, null, 2));

    if (
      response.data.choices &&
      response.data.choices.length > 0 &&
      response.data.choices[0].message
    ) {
      const suggestionText = response.data.choices[0].message.content;
      console.log("Suggestion text from AI:", suggestionText);
      return res.json({ suggestions: suggestionText });
    } else {
      console.error("No suggestions available in response.");
      return res.status(500).json({ error: "No suggestions available" });
    }
  } catch (error) {
    console.error(
      "Error retrieving suggestions:",
      error.response ? error.response.data : error.message
    );
    return res.status(500).json({ error: "Error retrieving suggestions" });
  }
});

router.post("/event/:eventId/add-guest", (req, res) => {
  const { eventId } = req.params;
  const { name, email, phone, status } = req.body;

  const query = `
    INSERT INTO guests (event_id, name, email, phone, status) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [eventId, name, email, phone, status || "Pending"], (err) => {
    if (err) {
      console.error(" Error adding guest:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ message: "Guest added successfully!" });
  });
});

router.delete("/guests/:guestId", (req, res) => {
  const { guestId } = req.params;

  db.query("DELETE FROM guests WHERE id = ?", [guestId], (err) => {
    if (err) {
      console.error(" Error removing guest:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ message: "Guest removed successfully!" });
  });
});

// Test route
router.get("/test", (req, res) => {
  res.status(200).json({ message: "Test route works!" });
});

module.exports = router;
