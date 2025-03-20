const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { sendEmail } = require("../config/mail");

router.post("/event/:eventId/send-invites", async (req, res) => {
  const { eventId } = req.params;
  const { style } = req.body; // Invitation style

  try {
    const [guests] = await db.promise().query("SELECT email, name FROM guests WHERE event_id = ?", [eventId]);
    if (!guests.length) {
      return res.status(404).json({ message: "No guests found for this event" });
    }

    const [eventResult] = await db.promise().query("SELECT * FROM event_responses WHERE id = ?", [eventId]);
    if (!eventResult.length) {
      return res.status(404).json({ message: "Event not found" });
    }
    const event = eventResult[0];

    const subject = `Invitation to ${event.event_name || "Our Special Event"}`;
    let message = "";
    switch (style) {
      case "whimsical":
        message = `
          <div style="font-family: 'Times New Roman', serif; background-color: #fefdf6; padding: 20px; border-radius: 8px;">
            <h1 style="color: #6c5a51;">✨ You're Invited to a Magical Celebration! ✨</h1>
            <p>🌸 Join us for <strong>${event.event_name || "a special event"}</strong></p>
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
            <p>🎊 Celebrate <strong>${event.event_name || "this special occasion"}</strong></p>
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
            <p>🥳 Let's have fun at <strong>${event.event_name || "an amazing event"}</strong></p>
            <p>📅 Date: ${event.event_date || "TBD"}</p>
            <a href="#" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">🎟️ RSVP Now</a>
          </div>
        `;
        break;
      default:
        return res.status(400).json({ message: "Invalid invitation style" });
    }

    // Send invitation emails and update guest status
    for (const guest of guests) {
      await sendEmail(guest.email, subject, message);
      await db.promise().query("UPDATE guests SET status = 'Email Sent!' WHERE email = ?", [guest.email]);
    }

    res.status(200).json({ message: "Invitations sent successfully!" });
  } catch (error) {
    console.error("Error sending invites:", error);
    res.status(500).json({ message: "Error sending invitations" });
  }
});

module.exports = router;

/**
 * This module defines the API route for sending event invitations to guests.
 * It allows users to send customized invitation emails to all guests associated
 * with a specific event using different invitation styles.
 * 
 * - `express.Router()`: Creates a new router instance for handling invitation-related routes.
 * - `db`: The MySQL database connection imported from `../config/db`.
 * - `sendEmail()`: Imported from `../config/mail`, this function is used to send emails.
 * 
 * ## Route:
 * 
 * ### POST `/event/:eventId/send-invites`
 * - Retrieves the list of guests for the specified `eventId`.
 * - Fetches the event details to personalize the invitation email.
 * - Supports different invitation styles: `"whimsical"`, `"classic"`, `"professional"`, and `"fun"`, each with unique HTML templates.
 * - Sends an email to each guest with the generated invitation.
 * - Updates the guest's status in the database to `"Email Sent!"` after successfully sending the invitation.
 * - Returns a `200` response if invitations are sent successfully, or an appropriate error message if something goes wrong.
 * 
 * ## Error Handling:
 * - Returns `404` if no guests are found for the event.
 * - Returns `404` if the event itself does not exist.
 * - Returns `400` if an invalid invitation style is provided.
 * - Catches and logs any unexpected errors during the email sending process or database updates.
 * 
 * This route is crucial for the event management system, ensuring seamless communication
 * between event organizers and guests by automating invitation distribution.
 */
