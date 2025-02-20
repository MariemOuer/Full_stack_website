export const STANDARD_OCCASIO_INVITE_BODY = '';

export const STANDARD_OCCASIO_NOTIFY_BODY = '';

export const INVITATION_EMAIL_TEMPLATE = (eventTitle: string, eventDate: string, location: string) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; background-color: #f9f9f9; border-radius: 8px;">
    <h2 style="color: #333; text-align: center;">You're Invited! 🎉</h2>
    <p style="font-size: 16px; color: #555;">We are thrilled to invite you to <strong>${eventTitle}</strong>!</p>
    <p><strong>📅 Date:</strong> ${eventDate}</p>
    <p><strong>📍 Location:</strong> ${location}</p>
    <p style="font-size: 16px; color: #555;">Click below to RSVP:</p>
  </div>
`;

export const NOTIFICATION_EMAIL_TEMPLATE = (notificationMessage: string) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; background-color: #f9f9f9; border-radius: 8px;">
    <h2 style="color: #333; text-align: center;">🔔 Notification</h2>
    <p style="font-size: 16px; color: #555;">${notificationMessage}</p>
    <p style="font-size: 14px; color: #777;">If you have any questions, feel free to reply to this email.</p>
  </div>
`;
