import React, { useState, useEffect } from "react";
import "../styles/saved_events.css";
import { apiService } from "../services/ApiService";

const SavedEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiService.get("/api/chat-bot/all-events");
        const data = response.data;
        setEvents(data);
        if (response.ok) {
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  console.log(events);

  return (
    <div className="container">
      <h1 className="heading">Saved Events</h1>
      {loading ? (
        <p className="message">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="message">No events found.</p>
      ) : (
        <div className="events-container">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <h2 className="event-title">{event.event_name || "Untitled Event"}</h2>
              <p>
                <strong>User Email:</strong> {event.user_email}
              </p>
              <p>
                <strong>Event Type:</strong> {event.event_type}
              </p>
              <p>
                <strong>Date:</strong> {event.event_date}
              </p>
              <p>
                <strong>Length:</strong> {event.event_length}
              </p>
              <p>
                <strong>Guest Count:</strong> {event.guest_count}
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <p>
                <strong>Catering:</strong> {event.catering}
              </p>
              <p>
                <strong>Theme:</strong> {event.theme}
              </p>
              <p>
                <strong>Entertainment:</strong> {event.entertainment}
              </p>
              <p>
                <strong>Budget:</strong> {event.budget}
              </p>
              <p>
                <strong>Accommodations:</strong> {event.accommodations}
              </p>
              <p>
                <strong>Special Requests:</strong> {event.special_requests}
              </p>
              <p>
                <strong>Timeline:</strong> {event.event_timeline}
              </p>
              <p className="created-at">
                <small>
                  <strong>Created at:</strong> {new Date(event.created_at).toLocaleString()}
                </small>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedEventsPage;
