import React, { useEffect, useState } from "react";
import { apiService } from "../services/ApiService";
import { useAuth } from "../context/AuthContext";
import "../styles/invitation_table.css";

function GuestListView() {
  const { customData } = useAuth();
  const userId = customData?.id;
  const [itineraryList, setItineraryList] = useState([]);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [invitationList, setInvitationList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);

  // Fetch itineraries when userId is available
  useEffect(() => {
    if (!userId) return; // Wait until userId is available
    async function fetchItineraries() {
      setLoading(true);
      try {
        const response = await apiService.get(`/api/itinerary/created-by/${userId}`);
        setItineraryList(response.data);
        if (response.data.length > 0) {
          setSelectedItinerary(response.data[0]); // Store full itinerary object
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch itineraries");
      } finally {
        setLoading(false);
      }
    }
    fetchItineraries();
  }, [userId]);

  // Fetch invitations when an itinerary is selected
  useEffect(() => {
    if (!selectedItinerary || !selectedItinerary.id) return;
    async function fetchInvitations() {
      setLoading(true);
      try {
        const response = await apiService.get(`/api/invitation/invitation-list/${selectedItinerary.id}`);
        setInvitationList(response.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch invitations");
      } finally {
        setLoading(false);
      }
    }
    fetchInvitations();
  }, [selectedItinerary]);

  const handleAddGuestClick = (e) => {
    e.preventDefault();
    setShowAddGuestModal(true);
  };

  const handleSendReminder = (e) => {
    e.preventDefault();
    // Implement send reminder functionality
    alert("Reminders sent to pending guests!");
  };

  const getStatusClass = (status) => {
    if (!status) return "status-pending";

    const statusLower = status.toLowerCase();
    if (statusLower === "accepted" || statusLower === "confirmed") {
      return "status-accepted";
    } else if (statusLower === "declined") {
      return "status-declined";
    } else {
      return "status-pending";
    }
  };

  // Loading state
  if (!userId) {
    return (
      <div className="invitation-list-container">
        <div className="loading-spinner">
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="invitation-list-container">
        <div className="error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="invitation-list-container">
      <h1 className="page-header">Guest List</h1>

      <div className="event-label">Event</div>
      <div className="event-selector">
        <select
          value={selectedItinerary?.id || ""}
          onChange={(e) => {
            const selected = itineraryList.find((itinerary) => itinerary.id === e.target.value);
            setSelectedItinerary(selected || itineraryList[0]);
          }}
        >
          <option value="" disabled>
            Select Event
          </option>
          {itineraryList.map((itinerary) => (
            <option key={itinerary.id} value={itinerary.id}>
              {itinerary.title}
            </option>
          ))}
        </select>
      </div>

      <div className="guest-actions">
        <a href="#" className="guest-action-link" onClick={handleAddGuestClick}>
          Add/Remove Guest
        </a>
        <a href="#" className="guest-action-link" onClick={handleSendReminder}>
          Send Reminder To Pending Guests
        </a>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <p>Loading guest list...</p>
        </div>
      ) : invitationList?.invitations?.length === 0 ? (
        <div className="empty-state">
          <h3>No Guests Added Yet</h3>
          <p>Start by adding guests to your invitation list.</p>
        </div>
      ) : (
        <table className="guest-table">
          <thead>
            <tr>
              <th>RSVP Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Party Of</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(invitationList?.invitations || []).map((guest) => {
              return (
                <tr key={guest.id}>
                  <td>{new Date(guest.rsvpDeadline).toLocaleDateString()}</td>
                  <td>{guest.name || "[FIRSTNAME] [LASTNAME]"}</td>
                  <td>
                    <a href={`mailto:${guest.email}`} className="guest-email">
                      {guest.email}
                    </a>
                  </td>
                  <td>{guest.partySize || 2}</td>
                  <td className={getStatusClass(guest.status)}>{guest.status || "Pending"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Add Guest Modal would go here */}
      {showAddGuestModal && (
        <div className="modal-overlay" onClick={() => setShowAddGuestModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Guest</h3>
              <button className="modal-close" onClick={() => setShowAddGuestModal(false)}>
                ×
              </button>
            </div>

            <form className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" />
              </div>

              <div className="form-group">
                <label htmlFor="partySize">Party Size</label>
                <input type="number" id="partySize" name="partySize" min="1" defaultValue="2" />
              </div>

              <div className="modal-buttons">
                <button type="button" className="secondary" onClick={() => setShowAddGuestModal(false)}>
                  Cancel
                </button>
                <button type="button" className="primary">
                  Add Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuestListView;
