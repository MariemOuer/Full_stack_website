require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const db = require("./database.js"); // ✅ Import MySQL connection

const app = express();
const PORT = process.env.PORT || 3014;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("❌ Missing OpenRouter API Key. Set OPENROUTER_API_KEY in .env file.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

/**
 * ✅ Route to Save Chatbot Responses to MySQL
 */
app.post("/save-event", (req, res) => {
  const { user_email, event_name, event_type, event_date, event_length, guest_count, location, catering, theme, entertainment, budget, accommodations, special_requests, event_timeline } = req.body;

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
      console.error("❌ Error saving event:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ message: "✅ Event saved successfully!" });
  });
});

/**
 * ✅ Route to Get Saved Events from MySQL
 */
app.get("/events", (req, res) => {
  db.query("SELECT * FROM event_responses", (err, results) => {
    if (err) {
      console.error("❌ Error fetching events:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ events: results });
  });
});

/**
 * ✅ Route to Generate Suggestions Using OpenRouter AI
 */
app.post("/suggestions", async (req, res) => {
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

    if (response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message) {
      const suggestionText = response.data.choices[0].message.content;
      console.log("Suggestion text from AI:", suggestionText);
      return res.json({ suggestions: suggestionText });
    } else {
      console.error("No suggestions available in response.");
      return res.status(500).json({ error: "No suggestions available" });
    }
  } catch (error) {
    console.error("Error retrieving suggestions:", error.response ? error.response.data : error.message);
    return res.status(500).json({ error: "Error retrieving suggestions" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
