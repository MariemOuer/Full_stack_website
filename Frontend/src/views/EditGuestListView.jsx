import React, { useState, useEffect } from "react";
import { apiService } from "../services/ApiService";
import { useParams } from "react-router-dom";
import "../styles/guestListStyle.css";
import Navbar from "./NavbarView";
import Footer from "./FooterView";

const EditGuestListView = () => {
  const { eventId } = useParams();
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState({ name: "", email: "", phone: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState("whimsical");

  useEffect(() => {
    fetchGuests();
  }, [eventId]);

  const fetchGuests = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get(`/event/${eventId}/guests`);
      setGuests(response.data);
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
    setIsLoading(false);
  };

  const handleAddGuest = async () => {
    if (!newGuest.name || !newGuest.email) {
      alert("Name and email are required!");
      return;
    }

    try {
      await apiService.post(`/event/${eventId}/add-guest`, newGuest);
      setNewGuest({ name: "", email: "", phone: "" });
      fetchGuests();
    } catch (error) {
      console.error("Error adding guest:", error);
    }
  };

  const handleRemoveGuest = async (guestId) => {
    try {
      await apiService.delete(`/guests/${guestId}`);
      fetchGuests();
    } catch (error) {
      console.error("Error removing guest:", error);
    }
  };

  const handleSendInvites = async () => {
    try {
      await apiService.post(`/event/${eventId}/send-invites`, {
        style: selectedStyle,
      });
      fetchGuests();
    } catch (error) {
      console.error("Error sending invites:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="guest-list-container">
        <h1 className="guest-list-heading">Guest List</h1>

        <div className="guest-list-options">
          {/* Dropdown to Select Invitation Style */}
          <div className="dropdown-selector">
            <label htmlFor="style-select">Select Invitation Style:</label>
            <select id="style-select" onChange={(e) => setSelectedStyle(e.target.value)} value={selectedStyle}>
              <option value="whimsical">Whimsical</option>
              <option value="classic">Classic</option>
              <option value="professional">Professional</option>
              <option value="fun">Fun</option>
            </select>
          </div>

          {/* Send Invitations Button */}
          <button className="send-reminder-btn" onClick={handleSendInvites}>
            Send Invitations
          </button>
        </div>

        {isLoading ? (
          <p>Loading guests...</p>
        ) : (
          <div className="guest-table-wrapper">
            <table className="guest-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <tr key={guest.id}>
                    <td>{guest.name}</td>
                    <td>{guest.email}</td>
                    <td>{guest.phone || "N/A"}</td>
                    <td>{guest.status}</td>
                    <td>
                      <img src="/trash-red.png" alt="trashcan" className="remove-btn" onClick={() => handleRemoveGuest(guest.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="add-guest-section">
          <h2>Add New Guest:</h2>
          <input type="text" placeholder="Name" value={newGuest.name} onChange={(event) => setNewGuest({ ...newGuest, name: event.target.value })} />
          <input type="email" placeholder="Email" value={newGuest.email} onChange={(event) => setNewGuest({ ...newGuest, email: event.target.value })} />
          <input type="text" placeholder="Phone" value={newGuest.phone} onChange={(event) => setNewGuest({ ...newGuest, phone: event.target.value })} />
          <button onClick={handleAddGuest} className="add-guest-btn">
            Add Guest
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditGuestListView;
