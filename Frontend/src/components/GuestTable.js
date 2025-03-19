import React, { useState } from "react";
import "../styles/invitation_table.css";
import AddGuestModal from "./AddGuestModal";

// Using an inline SVG trash icon instead of an image file
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path>
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const GuestTable = ({ itineraryUUID, itineraryPartySize, invitations }) => {
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);

  const handleRowClick = (guestId) => {
    setSelectedGuest(selectedGuest === guestId ? null : guestId);
  };

  const toggleAddGuestModal = () => {
    setShowAddGuestModal(!showAddGuestModal);
  };

  const getStatusClassName = (status) => {
    switch (status?.toUpperCase()) {
      case "INVITED":
        return "status-invited";
      case "CONFIRMED":
        return "status-confirmed";
      case "DECLINED":
        return "status-declined";
      default:
        return "status-pending";
    }
  };

  // Mock function for deleting a guest - replace with actual implementation
  const handleDeleteGuest = (guestId, e) => {
    e.stopPropagation(); // Prevent row click event
    if (window.confirm("Are you sure you want to remove this guest?")) {
      console.log("Deleting guest with ID:", guestId);
      // Implement actual delete functionality here
    }
  };

  // Handle send reminders functionality
  const handleSendReminders = () => {
    const pendingGuests = invitations.filter((guest) => guest.status?.toUpperCase() !== "CONFIRMED" && guest.status?.toUpperCase() !== "DECLINED");

    if (pendingGuests.length === 0) {
      alert("There are no pending guests to remind.");
      return;
    }

    if (window.confirm(`Send reminders to ${pendingGuests.length} pending guests?`)) {
      console.log("Sending reminders to:", pendingGuests);
      // Implement actual reminder sending functionality here
    }
  };

  return (
    <div className="invite-table-component">
      <h2 className="page-header">Guest List</h2>

      <div className="invite-table-options">
        <a href="#" onClick={toggleAddGuestModal}>
          Add Guest
        </a>
        <a href="#" onClick={handleSendReminders}>
          Send Reminder To Pending Guests
        </a>
      </div>

      {invitations.length === 0 ? (
        <div className="empty-state">
          <h3>No Guests Added Yet</h3>
          <p>Start by adding guests to your invitation list.</p>
        </div>
      ) : (
        <table className="invite-table">
          <thead>
            <tr className="invite-table-header">
              <th>RSVP Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Party Of</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((guest) => (
              <React.Fragment key={guest.id}>
                <tr onClick={() => handleRowClick(guest.id?.toString())} className={selectedGuest === guest.id?.toString() ? "selected" : ""}>
                  <td>{new Date(guest.rsvpDeadline).toLocaleDateString()}</td>
                  <td>{guest.name}</td>
                  <td>
                    <a href={`mailto:${guest.email}`}>{guest.email}</a>
                  </td>
                  <td>{guest.partySize || 2}</td>
                  <td>
                    <span className={`status-pill ${getStatusClassName(guest.status)}`}>{guest.status || "Pending"}</span>
                  </td>
                  <td>
                    <button className="delete-button" onClick={(e) => handleDeleteGuest(guest.id, e)}>
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
                {selectedGuest === guest.id?.toString() && (
                  <tr className="dropdown-row">
                    <td colSpan={6}>
                      <div className="dropdown-content">
                        <div className="dropdown-content-row">
                          <div>
                            <span className="dropdown-content-header">Email</span>
                            <a href={`mailto:${guest.email}`}>{guest.email}</a>
                          </div>
                          <div>
                            <span className="dropdown-content-header">Party Of</span>
                            {guest.partySize || 2}
                          </div>
                        </div>
                        <div className="dropdown-content-row">
                          <div>
                            <span className="dropdown-content-header">Status</span>
                            {guest.status || "Pending"}
                          </div>
                          <div>
                            <span className="dropdown-content-header">Last Updated</span>
                            {guest.updatedAt ? new Date(guest.updatedAt).toLocaleString() : "N/A"}
                          </div>
                        </div>
                        <div className="dropdown-content-row">
                          <div>
                            <span className="dropdown-content-header">RSVP Deadline</span>
                            {new Date(guest.rsvpDeadline).toLocaleDateString()}
                          </div>
                          <div>
                            <button className="delete-button" onClick={(e) => handleDeleteGuest(guest.id, e)}>
                              <TrashIcon />
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      {showAddGuestModal && <AddGuestModal onClose={toggleAddGuestModal} itineraryId={itineraryUUID} />}
    </div>
  );
};

export default GuestTable;
