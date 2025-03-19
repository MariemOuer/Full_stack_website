import InvitationTable from "../components/invitation_table";
import { apiService } from "../services/ApiService";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/invitation_table.css";

function InvitationListView() {
  const { customData } = useAuth();
  const userId = customData?.id;

  const [itineraryList, setItineraryList] = useState([]);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [invitationList, setInvitationList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  if (!userId) return <p>Loading user data...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="invitation-list-container">
      {/* Dropdown to select itinerary */}
      <div className="itinerary-selector">
        <select
          className="input"
          value={selectedItinerary?.id || ""}
          onChange={(e) => {
            const selected = itineraryList.find((itinerary) => itinerary.id === e.target.value);
            setSelectedItinerary(selected || itineraryList[0]); // Ensure a valid object is selected
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
      </div>

      {/* Show invitations */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <InvitationTable itineraryUUID={invitationList?.itineraryUUID || ""} itineraryPartySize={invitationList?.itineraryPartySize || 0} invitations={invitationList?.invitations || []} />
      )}
    </div>
  );
}

export default InvitationListView;
