const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "occasio401@gmail.com",  
    pass: "lgtf dlro ilxn zuja",    
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"Occasio Events" <occasio401@gmail.com>`,
      to,
      subject,
      html: htmlContent,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
};

module.exports = { transporter, sendEmail };

/**
 * This module sets up and exports an email transport system using Nodemailer.
 * It allows the application to send emails through the Gmail SMTP server.
 * 
 * - `nodemailer.createTransport()`: Creates a transport instance that connects to Gmail’s SMTP server.
 * - `host`: Specifies the SMTP server (`smtp.gmail.com`).
 * - `port`: Uses port `587`, which is the standard port for sending emails with TLS.
 * - `secure`: Set to `false` to use STARTTLS encryption instead of SSL.
 * - `auth`: Contains the credentials needed for authentication.
 *    - `user`: The sender email address (`occasio401@gmail.com`).
 *    - `pass`: The app-specific password for Gmail authentication (Note: Hardcoding credentials is insecure).
 * 
 * The `sendEmail` function is an async function that takes:
 * - `to`: Recipient email address.
 * - `subject`: Email subject line.
 * - `htmlContent`: The email body in HTML format.
 * 
 * When called, it sends an email and logs a success message upon success or an error message if it fails.
 * Finally, both the `transporter` and `sendEmail` function are exported for use in other parts of the application.
 */
