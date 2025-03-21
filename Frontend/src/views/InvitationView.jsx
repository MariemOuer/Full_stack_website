import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiService } from "../services/ApiService";
import Navbar from "./NavbarView";
import Footer from "./FooterView";
import "../styles/invitationStyle.css";

const InvitationView = () => {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setIsLoading] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState("whimsical");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await apiService.get(`/event/${eventId}`);
        setEventData(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleStyleChange = (event) => {
    setSelectedStyle(event.target.value);
  };

  const renderInvitation = () => {
    if (!eventData) return <p>Event not found.</p>;

    const { event_name, event_date, location, theme } = eventData;

    const content = {
      whimsical: {
        title: "Be Our Guest!",
        description: `Join us for <strong>${event_name || "a special event"}</strong>`,
      },
      classic: {
        title: "You're Invited!",
        description: `Celebrate <strong>${event_name || "this special occasion with us"}</strong>`,
      },
      professional: {
        title: "You're Invited to Our Professional Event",
        description: `<strong>${event_name || "Business Event"}</strong>`,
      },
      fun: {
        title: "🎉 Party Time! 🎉",
        description: `Let's have fun at <strong>${event_name || "our amazing event"}</strong>`,
      },
    };

    const { title, description } = content[selectedStyle];

    return (
      <div className={`invitation-box ${selectedStyle}`}>
        <h1>{title}</h1>
        <p dangerouslySetInnerHTML={{ __html: description }} />
        <div className="divider" />
        <p>
          <strong>Date:</strong> {event_date || "TBD"}
          <br />
          <strong>Location:</strong> {location || "TBD"}
          <br />
          <strong>Theme:</strong> {theme || "A wonderful surprise!"}
        </p>
        <div className="invitation-footer">We can't wait to see you there!</div>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="invitation-page-container">
        <div className="left-page">
          <h1>View Invitation</h1>
          <label htmlFor="style-select">Choose an invitation style:</label>
          <select id="style-select" onChange={handleStyleChange} value={selectedStyle}>
            <option value="whimsical">Whimsical</option>
            <option value="classic">Classic</option>
            <option value="professional">Professional</option>
            <option value="fun">Fun</option>
          </select>
        </div>
        <div className="right-page">{loading ? <p>Loading...</p> : renderInvitation()}</div>
      </div>
      <Footer />
    </div>
  );
};

export default InvitationView;
