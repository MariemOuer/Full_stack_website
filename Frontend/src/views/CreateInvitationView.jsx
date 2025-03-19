import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/ApiService";
import "../styles/create_invitation.css";

const CreateInvitationPage = () => {
  return (
    <div className="container full-height no-background">
      {/* Left Side - Form */}
      <div className="form-container expanded">
        <h2 className="title">Let’s Create Your Invitation!</h2>
        <InvitationForm />
      </div>

      {/* Right Side - Preview Box */}
      <div className="preview-container expanded">
        <PreviewBox />
      </div>
    </div>
  );
};

const InvitationForm = () => {
  const { customData } = useAuth();
  const userId = customData?.id;

  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [itineraryList, setItineraryList] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch itineraries
  useEffect(() => {
    if (!userId) return;

    async function fetchItineraries() {
      try {
        const response = await apiService.get(`/api/itinerary/created-by/${userId}`);
        setItineraryList(response.data);
        if (response.data.length > 0) {
          setSelectedItinerary(response.data[0]); // Set default itinerary
        }
      } catch (error) {
        console.error("Failed to fetch itineraries:", error);
      }
    }

    fetchItineraries();
  }, [userId]);

  // Handle Invite Guests button click
  const handleInviteGuests = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (!selectedItinerary || !selectedItinerary.id) {
      setError("Please select a valid itinerary before inviting guests.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.post(`/api/invitation/notify-all/${selectedItinerary.id}`);
      setSentEmails(response.data);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send invitations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={(e) => e.preventDefault()}>
      {" "}
      {/* Prevent full page reload */}
      {/* Itinerary Selection Dropdown */}
      <select
        className="input"
        value={selectedItinerary?.id || ""}
        onChange={(e) => {
          const selected = itineraryList.find((itinerary) => itinerary.id.toString() === e.target.value);
          setSelectedItinerary(selected || null);
        }}
      >
        <option value="" disabled>
          Select Itinerary
        </option>
        {itineraryList.map((itinerary) => (
          <option key={itinerary.id} value={itinerary.id}>
            {itinerary.title}
          </option>
        ))}
      </select>
      <div className="button-wrapper">
        <PrimaryButton text={loading ? "Sending..." : "Invite Guests"} onClick={handleInviteGuests} />
      </div>
      {/* Display Sent Emails */}
      {sentEmails.length > 0 && (
        <div className="sent-emails">
          <h3>Invitations Sent To:</h3>
          <ul>
            {sentEmails.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
        </div>
      )}
      {/* Show Errors */}
      {error && <p className="error">{error}</p>}
    </form>
  );
};

const PreviewBox = () => {
  return (
    <div className="preview-box full-height">
      <p className="preview-text">Preview your invitation here</p>
    </div>
  );
};

const PrimaryButton = ({ text, onClick }) => {
  return (
    <button className="button" onClick={onClick} disabled={!onClick}>
      {text}
    </button>
  );
};

export default CreateInvitationPage;
