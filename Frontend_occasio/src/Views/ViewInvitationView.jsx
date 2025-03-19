import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiService } from "../services/ApiService";
import Navbar from "./NavbarView";
import Footer from "./FooterView";
import '../styles/viewInvitationStyle.css';

const ViewInvitationView = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState("whimsical"); // Default style

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await apiService.get(`/event/${eventId}`);
        setEvent(response.data);
      } catch (error) {
        console.error("❌ Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleStyleChange = (e) => {
    setSelectedStyle(e.target.value);
  };

  const renderInvitation = () => {
    if (!event) return <p>Event not found.</p>;

    const { event_name, event_date, location, theme, catering, entertainment, special_requests, guest_count } = event;

    switch (selectedStyle) {
      case "whimsical":
        return (
          <div className="invitation-box whimsical">
            <h1>✨ You're Invited to a Magical Celebration! ✨</h1>
            <p>🌸 Join us for <strong>{event_name || "a special event"}</strong></p>
            <p>📅 Date: {event_date || "TBD"}</p>
            <p>📍 Location: {location || "TBD"}</p>
            <p>🎭 Theme: {theme || "A wonderful surprise!"}</p>
            <p>📝 Special Requests: {special_requests || "None"}</p>
            <a href="#" className="rsvp-btn">🎟️ RSVP Now</a>
          </div>
        );

      case "classic":
        return (
          <div className="invitation-box classic">
            <h1>💌 You're Invited!</h1>
            <p>🎊 Celebrate <strong>{event_name || "this special occasion"}</strong></p>
            <p>📅 Date: {event_date || "TBD"}</p>
            <p>📍 Location: {location || "TBD"}</p>
            <p>👥 Expected Guests: {guest_count || "Unknown"}</p>
            <a href="#" className="rsvp-btn">🎟️ RSVP Now</a>
            <p className="footer-text">💖 We can't wait to celebrate with you!</p>
          </div>
        );

      case "professional":
        return (
          <div className="invitation-box professional">
            <h1>📢 Join Us for a Professional Gathering</h1>
            <p><strong>{event_name || "Business Event"}</strong></p>
            <p>📅 Date: {event_date || "TBD"}</p>
            <p>📍 Location: {location || "TBD"}</p>
            <p>🎤 Entertainment: {entertainment || "Formal Networking"}</p>
            <a href="#" className="rsvp-btn">📩 RSVP Here</a>
          </div>
        );

      case "fun":
        return (
          <div className="invitation-box fun">
            <h1>🎉 Party Time! 🎉</h1>
            <p>🥳 Let's have fun at <strong>{event_name || "an amazing event"}</strong></p>
            <p>📅 Date: {event_date || "TBD"}</p>
            <p>📍 Location: {location || "TBD"}</p>
            <p>🎶 Entertainment: {entertainment || "Surprise Acts!"}</p>
            <p>🍽️ Catering: {catering || "Delicious food provided!"}</p>
            <a href="#" className="rsvp-btn">🎟️ RSVP Now</a>
          </div>
        );

      default:
        return <p>❌ Invalid selection</p>;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>📜 View Invitation</h1>
        <label htmlFor="style-select">🎨 Choose an invitation style:</label>
        <select id="style-select" onChange={handleStyleChange} value={selectedStyle}>
          <option value="whimsical">✨ Whimsical</option>
          <option value="classic">💌 Classic</option>
          <option value="professional">📢 Professional</option>
          <option value="fun">🎉 Fun</option>
        </select>

        {loading ? <p>⏳ Loading...</p> : renderInvitation()}
      </div>
      <Footer />
    </div>
  );
};

export default ViewInvitationView;
