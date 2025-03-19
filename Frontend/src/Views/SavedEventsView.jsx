import React, { useState, useEffect } from "react";
import { SavedEventsController } from "../controllers/SavedEventsController";
import { useAuth } from "../context/AuthContext";
import "../styles/savedEventsStyle.css";
import { Link } from "react-router-dom";
import Footer from "./FooterView";
import Navbar from "./NavbarView";

const SavedEventsView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const eventsData = await SavedEventsController.fetchEvents();

      // Determine the correct user email for filtering
      let userEmail = currentUser?.email?.toLowerCase();

      if (userEmail === "guest@gmail.com") {
        userEmail = "Guest"; // Match how it's stored in the database
      }

      console.log("Filtering events for user:", userEmail);

      // Filter events where user_email matches the current user's email
      const userEvents = eventsData.filter(
        (event) => event.user_email?.toLowerCase() === userEmail.toLowerCase()
      );

      console.log("Filtered events:", userEvents); // Debugging

      setEvents(userEvents);
      setLoading(false);

      // Default to the first event if available
      if (userEvents.length > 0) {
        setSelectedEvent(userEvents[0]);
      }
    };

    if (currentUser) {
      fetchEvents();
    }
  }, [currentUser]);

  const handleEventChange = (eventId) => {
    const eventIdNumber = Number(eventId); // Convert to number since select returns a string
    const event = events.find((e) => e.id === eventIdNumber);
    setSelectedEvent(event);
  };

  return (
    <div>
      <Navbar />
      <div className="saved-events-container">
        <div className="profile-header">
          <h1 className="welcome-text">Welcome back!</h1>
          <p className="user-email">
            <strong>Current User:</strong>{" "}
            {currentUser?.email?.toLowerCase() === "guest@gmail.com"
              ? "Guest"
              : currentUser?.email}
          </p>
        </div>

        <div className="events-header">
          <h2 className="saved-events-heading">Saved Events</h2>
          <div className="event-dropdown">
            <label htmlFor="eventSelector">Event</label>
            <select
              id="eventSelector"
              value={selectedEvent?.id || ""}
              onChange={(e) => handleEventChange(e.target.value)}
            >
              {events.map((event, index) => (
                <option key={event.id} value={event.id}>
                  {event.event_name || `Event ${index + 1}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="loading-text">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="no-events-text">No events found.</p>
        ) : (
          selectedEvent && (
            <div className="event-box">
              <table className="event-table">
                <thead>
                  <tr>
                    <th>Event Details</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Event Type:</strong>
                    </td>
                    <td>{selectedEvent.event_type}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Event Date:</strong>
                    </td>
                    <td>{selectedEvent.event_date}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Event Length:</strong>
                    </td>
                    <td>{selectedEvent.event_length}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Guest Count:</strong>
                    </td>
                    <td>{selectedEvent.guest_count}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Location:</strong>
                    </td>
                    <td>{selectedEvent.location}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Catering:</strong>
                    </td>
                    <td>{selectedEvent.catering}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Theme:</strong>
                    </td>
                    <td>{selectedEvent.theme}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Entertainment:</strong>
                    </td>
                    <td>{selectedEvent.entertainment}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Accommodations:</strong>
                    </td>
                    <td>{selectedEvent.accommodations}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Special Requests:</strong>
                    </td>
                    <td>{selectedEvent.special_requests}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Event Timeline:</strong>
                    </td>
                    <td>{selectedEvent.event_timeline}</td>
                  </tr>

                  {/* Budget Section - Make it slightly darker */}
                  <tr className="budget-section">
                    <td colSpan="2"></td>
                  </tr>
                  <tr className="budget-section">
                    <td>
                      <strong>Budget:</strong>
                    </td>
                    <td>${selectedEvent.budget}</td>
                  </tr>
                </tbody>
              </table>

              <div className="event-actions">
                <Link
                  to={`/view-invitation/${selectedEvent.id}`}
                  className="action-link"
                >
                  View Invitation
                </Link>

                <Link
                  to={`/edit-guest-list/${selectedEvent.id}`}
                  className="action-link"
                >
                  Edit Guest List
                </Link>
              </div>
            </div>
          )
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SavedEventsView;
