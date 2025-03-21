const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { sendEmail } = require("../config/mail");

router.post("/event/:eventId/send-invites", async (req, res) => {
  const { eventId } = req.params;
  const { style } = req.body;

  try {
    const [guests] = await db.promise().query(
      "SELECT email, name FROM guests WHERE event_id = ?",
      [eventId]
    );
    if (!guests.length) {
      return res.status(404).json({ message: "No guests found for this event" });
    }

    const [eventResult] = await db.promise().query(
      "SELECT * FROM event_responses WHERE id = ?",
      [eventId]
    );
    if (!eventResult.length) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = eventResult[0];
    const subject = `Invitation to ${event.event_name || "Our Special Event"}`;

    for (const guest of guests) {
      const { event_name, event_date, location, theme } = event;
      let title = "";
      let description = "";
      let styleBlock = "";

      switch (style) {
        case "whimsical":
          title = "Be Our Guest!";
          description = `Join us for <strong>${event_name || "a special event"}</strong>`;
          styleBlock = `
            font-family: 'Times New Roman', serif;
            background-color: #fefdf6;
            color: #6c5a51;
            border: 1px solid #e3dec6;
          `;
          break;
        case "classic":
          title = "You're Invited!";
          description = `Celebrate <strong>${event_name || "this special occasion with us"}</strong>`;
          styleBlock = `
            font-family: 'Georgia', serif;
            background-color: #fff7f3;
            color: #5e4a4a;
            border: 1px solid #e4d7d3;
          `;
          break;
        case "professional":
          title = "You're Invited to Our Professional Event";
          description = `<strong>${event_name || "Business Event"}</strong>`;
          styleBlock = `
            font-family: 'Arial', sans-serif;
            background-color: #ffffff;
            color: #333;
            border: 1px solid #dcdcdc;
          `;
          break;
        case "fun":
          title = "🎉 Party Time! 🎉";
          description = `Let's have fun at <strong>${event_name || "our amazing event"}</strong>`;
          styleBlock = `
            font-family: 'Poppins', Arial, sans-serif;
            background-color: #ffffff;
            color: #007bff;
            border: 1.5px solid #007bff;
          `;
          break;
        default:
          return res.status(400).json({ message: "Invalid invitation style" });
      }

      const message = `
        <div style="max-width: 450px; margin: auto; padding: 30px; border-radius: 12px; text-align: center; ${styleBlock}">
          <h1>${title}</h1>
          <p>${description}</p>
          <hr style="margin: 20px 0;" />
          <p>
            <strong>Date:</strong> ${event_date || "TBD"}<br/>
            <strong>Location:</strong> ${location || "TBD"}<br/>
            <strong>Theme:</strong> ${theme || "A wonderful surprise!"}
          </p>
          <p style="font-style: italic; margin-top: 20px; font-size: 14px;">
            We can't wait to see you there!
          </p>
        </div>
      `;

      await sendEmail(guest.email, subject, message);
      await db
        .promise()
        .query("UPDATE guests SET status = 'Email Sent!' WHERE email = ?", [guest.email]);
    }

    res.status(200).json({ message: "Invitations sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending invites:", error);
    res.status(500).json({ message: "Error sending invitations" });
  }
});

module.exports = router;
