import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiService } from '../services/ApiService';
import Navbar from "./NavbarView";
import Footer from "./FooterView";

const EditEventDetailsView = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Edit Event Details</h1>
        {loading ? (
          <p>Loading...</p>
        ) : event ? (
          <div className="event-details-box">
            <h2>{event.event_name || "Event Details"}</h2>
            <p>
              <strong>Event Type:</strong> {event.event_type}
            </p>
            <p>
              <strong>Date:</strong> {event.event_date}
            </p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            <p>
              <strong>Theme:</strong> {event.theme}
            </p>
            <p>
              <strong>Budget:</strong> {event.budget}
            </p>
          </div>
        ) : (
          <p>Event not found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EditEventDetailsView;
