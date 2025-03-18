import InvitationTable from "../components/invitation_table";
import { apiService } from "../services/ApiService";
import { useEffect, useState } from "react";
import "../styles/invitation_table.css";

function InvitationListView() {
  const [invitationList, setInvitationList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInvitations() {
      try {
        const response = await apiService.get("/api/invitation/invitation-list/itinerary-3");
        setInvitationList(response.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown");
      } finally {
        setLoading(false);
      }
    }

    fetchInvitations();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return <InvitationTable itineraryUUID={invitationList?.itineraryUUID || ""} itineraryPartySize={invitationList?.itineraryPartySize || 0} invitations={invitationList?.invitations || []} />;
}

export default InvitationListView;
