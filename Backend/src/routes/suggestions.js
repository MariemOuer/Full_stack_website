// const express = require("express");
// const router = express.Router();
// const axios = require("axios");
// require("dotenv").config();

// router.post("/suggestions", async (req, res) => {
//   try {
//     const { context, question } = req.body;
//     if (!question) {
//       return res.status(400).json({ error: "Question is required" });
//     }

//     const prompt = `You are an event planning assistant. Based on the following details:
// ${context}

// and the question:
// ${question}

// Please provide exactly 3 suggestions in the following format:
// - Option 1: [suggestion]
// - Option 2: [suggestion]
// - Option 3: [suggestion]`;

//     const OPENROUTER_API_KEY = "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";

//     const response = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "rekaai/reka-flash-3:free",
//         messages: [{ role: "user", content: prompt }],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message) {
//       const suggestionText = response.data.choices[0].message.content;
//       return res.json({ suggestions: suggestionText });
//     } else {
//       return res.status(500).json({ error: "No suggestions available" });
//     }
//   } catch (error) {
//     console.error("Error retrieving suggestions:", error.response ? error.response.data : error.message);
//     return res.status(500).json({ error: "Error retrieving suggestions" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.post("/suggestions", async (req, res) => {
  try {
    const { context, question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // Updated prompt with instruction to limit responses to two sentences each.
    const prompt = `You are an event planning assistant. DONT USE ANY BOLDING OR ITALICS OR COMMAS AND ONLY GIVE ANSWERS IN SENTENCES. DO NOT USE NEWLINE CHARACTERS WITHIN OPTIONS. Based on the following details:
${context}

and the question:
${question}
IF YOU DO NOT FOLLOW THE INSTRUCTIONS YOU WILL FAIL THE TASK.
Please provide exactly 3 suggestions in the following format:
- Option 1: [suggestion]
- Option 2: [suggestion]
- Option 3: [suggestion]`;

    const OPENROUTER_API_KEY = "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";

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-small-3.1-24b-instruct",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message) {
      const suggestionText = response.data.choices[0].message.content;
      console.log(suggestionText);
      return res.json({ suggestions: suggestionText });
    } else {
      return res.status(500).json({ error: "No suggestions available" });
    }
  } catch (error) {
    console.error("Error retrieving suggestions:", error.response ? error.response.data : error.message);
    return res.status(500).json({ error: "Error retrieving suggestions" });
  }
});

module.exports = router;

/**
 * This module defines the API route for generating event planning suggestions using OpenRouter AI.
 * It allows users to receive AI-generated suggestions for event-related queries in a structured format.
 *
 * - `express.Router()`: Creates a new router instance for handling AI suggestion requests.
 * - `axios`: Used to send requests to the OpenRouter AI API.
 * - `dotenv`: Ensures environment variables (such as API keys) are properly loaded.
 *
 * ## Route:
 *
 * ### POST `/suggestions`
 * - Expects a `context` (event details) and a `question` (user query) in the request body.
 * - Constructs a structured prompt for the AI model to generate exactly **three suggestions**.
 * - Ensures that each suggestion is **limited to a maximum of two sentences** to prevent excessive response length.
 * - Calls OpenRouter AI’s API using the `"rekaai/reka-flash-3:free"` model.
 * - Returns the AI-generated suggestions in a structured JSON response.
 *
 * ## Error Handling:
 * - Returns `400` if no question is provided in the request.
 * - Returns `500` if the AI response is invalid or unavailable.
 * - Logs errors if the API request fails or encounters unexpected issues.
 *
 * This module enhances the event management system by leveraging AI-generated insights
 * to assist users in planning events more efficiently.
 */
