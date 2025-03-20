import React, { useState, useEffect, useRef } from "react";
import { SavedEventsController } from "../controllers/SavedEventsController";
import { useAuth } from "../context/AuthContext";
import "../styles/savedEventsStyle.css";
import { Link } from "react-router-dom";
import { checkIfCurrentUserIsGuest } from "../utils/GuestHelpers";

const SavedEventsView = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [animating, setAnimating] = useState(false);
  const eventBoxRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const eventsData = await SavedEventsController.fetchEvents();

      let userEmail = currentUser?.email?.toLowerCase();

      if (userEmail === "guest@gmail.com") {
        userEmail = "Guest";
      }

      console.log("Filtering events for user:", userEmail);

      const userEvents = eventsData.filter((event) => event.user_email?.toLowerCase() === userEmail.toLowerCase());

      console.log("Filtered events:", userEvents);

      setEvents(userEvents);
      setIsLoading(false);

      if (userEvents.length > 0) {
        setSelectedEvent(userEvents[0]);
      }
    };

    if (currentUser) {
      fetchEvents();
    }
  }, [currentUser]);

  const handleEventChange = (eventId) => {
    // Start animation
    setAnimating(true);

    // Add event-fade-in class to start the animation
    if (eventBoxRef.current) {
      eventBoxRef.current.classList.add("event-fade-in");
    }

    // Wait a short time before changing the event data
    setTimeout(() => {
      const eventIdNumber = Number(eventId);
      const event = events.find((event) => event.id === eventIdNumber);
      setSelectedEvent(event);

      // Remove the fade-in class and trigger reflow after data is changed
      setTimeout(() => {
        if (eventBoxRef.current) {
          eventBoxRef.current.classList.remove("event-fade-in");
        }
        setAnimating(false);
      }, 50);
    }, 300);
  };

  const renderEventDetailRow = (label, value) => (
    <tr>
      <td>
        <strong>{label}</strong>
      </td>
      <td>{value}</td>
    </tr>
  );

  // When component mounts, add the fade-in class and then remove it
  useEffect(() => {
    if (eventBoxRef.current && !isLoading && selectedEvent) {
      eventBoxRef.current.classList.add("event-fade-in");

      setTimeout(() => {
        if (eventBoxRef.current) {
          eventBoxRef.current.classList.remove("event-fade-in");
        }
      }, 50);
    }
  }, [isLoading, selectedEvent]);

  return (
    <div className="saved-events-container">
      <div className="profile-header">
        {checkIfCurrentUserIsGuest(currentUser) ? <h1 className="welcome-text">Welcome!</h1> : <h1 className="welcome-text">Welcome back!</h1>}
        <p className="user-email">
          <strong>Current User:</strong> {checkIfCurrentUserIsGuest(currentUser) ? "Guest" : currentUser?.email}
        </p>
      </div>

      <div className="events-header">
        <h2 className="saved-events-heading">Saved Events</h2>
        <div className="event-dropdown">
          <label htmlFor="eventSelector">Event</label>
          <select id="eventSelector" value={selectedEvent?.id || ""} onChange={(event) => handleEventChange(event.target.value)} disabled={animating}>
            {events.map((event, index) => (
              <option key={event.id} value={event.id}>
                {event.event_name || `Event ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <p className="loading-text">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="no-events-container">
          <p className="no-events-text">No events found.</p>
          <p className="no-events-subtext">Create your first event to get started!</p>
        </div>
      ) : (
        selectedEvent && (
          <div className="event-box" ref={eventBoxRef}>
            <table className="event-table">
              <thead>
                <tr>
                  <th>Details</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {renderEventDetailRow("Event Type:", selectedEvent.event_type)}
                {renderEventDetailRow("Event Date:", selectedEvent.event_date)}
                {renderEventDetailRow("Event Length:", selectedEvent.event_length)}
                {renderEventDetailRow("Guest Count:", selectedEvent.guest_count)}
                {renderEventDetailRow("Location:", selectedEvent.location)}
                {renderEventDetailRow("Catering:", selectedEvent.catering)}
                {renderEventDetailRow("Theme:", selectedEvent.theme)}
                {renderEventDetailRow("Entertainment:", selectedEvent.entertainment)}
                {renderEventDetailRow("Accommodations:", selectedEvent.accommodations)}
                {renderEventDetailRow("Special Requests:", selectedEvent.special_requests)}
                {renderEventDetailRow("Event Timeline:", selectedEvent.event_timeline)}
                <tr className="budget-section">
                  <td>
                    <strong>Budget:</strong>
                  </td>
                  <td>${selectedEvent.budget}</td>
                </tr>
              </tbody>
            </table>

            <div className="event-actions">
              <h3 className="actions-title">Event Actions</h3>
              <Link to={`/view-invitation/${selectedEvent.id}`} className="action-link">
                View Invitation
              </Link>
              <Link to={`/edit-guest-list/${selectedEvent.id}`} className="action-link">
                Edit Guest List
              </Link>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default SavedEventsView;
