// require("dotenv").config();
// const app = require("./src/app");

// const PORT = process.env.PORT || 3001;

// console.log(`IS_LOADED: ${process.env.IS_LOADED || "No"}`);

// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
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
  const [selectedStyle, setSelectedStyle] = useState("whimsical");

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

    const { event_name, event_date, location, theme, catering, entertainment } = event;

    const templates = {
      whimsical: `
        <table style="margin: auto; background-color:#ECF2E6; width:100%; padding: 60px 0;">
          <tr><td style="padding: 0;">
            <div style="font-family: 'Times New Roman', serif; padding: 50px; max-width: 400px; background-color: #fefdf6; border: 1px solid #e3dec6; border-radius: 15px; color: #64836f; margin: auto;">
              <h1 style="text-align: center; font-size: 36px; margin-bottom: 15px; color: #43634e;">Be Our Guest!</h1>
              <p style="font-size: 24px; text-align: center;">Join us for <strong>${event_name || "a special event"}</strong></p>
              <p style="font-size: 16px; text-align: center; margin: 20px 0;"><strong>Date:</strong> ${event_date || "TBD"} <br/><br/><strong>Location:</strong> ${location || "TBD"}</p>
              <p style="font-size: 16px; text-align: center; margin: 20px 0;"><strong>Theme:</strong> ${theme || "A wonderful surprise!"}</p>
            </div>
          </td></tr>
        </table>`,
      classic: `
        <table style="margin: auto; background-color: #FBECE6; width: 100%; padding: 60px 0;">
          <tr><td style="padding: 0;">
            <div style="font-family: 'Lato', sans-serif; padding: 50px; max-width: 400px; background-color: #fff7f3; border: 1px solid #e4d7d3; border-radius: 12px; color: #8a6d6d; margin: auto;">
              <h1 style="text-align: center; font-size: 28px; color: #d16a6a; font-family: 'Georgia', serif;">You're Invited!</h1>
              <p style="font-size: 18px; text-align: center;"><strong>Celebrate ${event_name || "this special occasion with us"}</strong></p>
            </div>
          </td></tr>
        </table>`,
      professional: `
        <table style="margin: auto; background-color: #F7F7F7; width: 100%; padding: 60px 0;">
          <tr><td style="padding: 0;">
            <div style="font-family: 'Arial', sans-serif; padding: 50px; max-width: 400px; background-color: #ffffff; border: 1px solid #dcdcdc; border-radius: 12px; margin: auto;">
              <h1 style="text-align: center; font-size: 26px; color: #2172ec;">You're Invited to Our Professional Event</h1>
              <p style="font-size: 16px; text-align: center;">Join us for <strong>${event_name || "Business Event"}</strong></p>
            </div>
          </td></tr>
        </table>`,
      fun: `
        <table style="margin: auto; background-color: #FEDFD7; width: 100%; padding: 60px 0;">
          <tr><td style="padding: 0;">
            <div style="font-family: 'Poppins', Arial, sans-serif; padding: 50px; max-width: 400px; background-color: #ffffff; border: 1.5px solid #EB726A; border-radius: 12px; margin: auto; text-align: center;">
              <h1 style="text-align: center; font-size: 28px; color: #CD645C;">🎉 Party Time! 🎉</h1>
              <p style="font-size: 16px; text-align: center;">Let's have fun at <strong>${event_name || "our amazing event"}</strong></p>
            </div>
          </td></tr>
        </table>`
    };

    return <div dangerouslySetInnerHTML={{ __html: templates[selectedStyle] }} />;
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
        <div className="right-page">
          {loading ? <p>Loading...</p> : renderInvitation()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewInvitationView;
