import React, { useState } from "react";
import { apiService } from "../services/ApiService";

const AddGuestModal = ({ onClose, itineraryId }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    partySize: 1,
    rsvpDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2 weeks from now
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Example API call to add a guest - adjust this to your actual API
      const response = await apiService.post(`/api/invitation/add-guest/${itineraryId}`, {
        ...formData,
        status: "INVITED", // Default status
      });

      if (response.status >= 200 && response.status < 300) {
        onClose(); // Close modal on success
        // You may want to refresh the guest list here or pass a callback to the parent
      } else {
        setError("Failed to add guest. Please try again.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to add guest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Add New Guest</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Guest Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter guest name" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" required />
          </div>

          <div className="form-group">
            <label htmlFor="partySize">Party Size</label>
            <input type="number" id="partySize" name="partySize" value={formData.partySize} onChange={handleChange} min="1" required />
          </div>

          <div className="form-group">
            <label htmlFor="rsvpDeadline">RSVP Deadline</label>
            <input type="date" id="rsvpDeadline" name="rsvpDeadline" value={formData.rsvpDeadline} onChange={handleChange} required />
          </div>

          <div className="modal-buttons">
            <button type="button" className="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="primary" disabled={loading}>
              {loading ? "Adding..." : "Add Guest"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGuestModal;
