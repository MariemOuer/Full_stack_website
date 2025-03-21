const express = require("express");
const router = express.Router();
const { sendEmail } = require("../config/mail");

router.get("/send-test-email", async (req, res) => {
  try {
    const testRecipient = "mariemouertatani2001@gmail.com";
    const subject = " Test Email from Occasio!";
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

    await sendEmail(testRecipient, subject, message);
    res.status(200).json({ message: `Test email sent to ${testRecipient}` });
  } catch (error) {
    console.error("Error sending test email:", error);
    res.status(500).json({ message: "Failed to send test email" });
  }
});

module.exports = router;

/**
 * This module defines an Express route for testing email functionality.
 * It allows the application to send a test email using the configured 
 * Nodemailer transporter.
 * 
 * - `express.Router()`: Creates a new router instance to handle email-related routes.
 * - `sendEmail()`: Imported from `../config/mail`, this function is used to send emails.
 * 
 * The `GET /send-test-email` route:
 * - Sends a predefined test email to `mariemouertatani2001@gmail.com` to verify that 
 *   the SMTP server (configured in Nodemailer) is working correctly.
 * - The email contains a subject (" Test Email from Occasio!") and a formatted 
 *   HTML message body.
 * - If the email is sent successfully, a JSON response with status `200` is returned.
 * - If an error occurs, it logs the error and returns a `500` status with an error message.
 * 
 * This route is useful for debugging and ensuring that the email system is properly 
 * configured before using it in production.
 */
