import InvitationTable from '../components/invitation_table';
import { apiService } from '../services/ApiService';
import { InvitationListDTO } from '../types/invitation_list_DTO';
import { useEffect, useState } from 'react';

function InvitationListView() {
  const [invitationList, setInvitationList] = useState<InvitationListDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvitations() {
      try {
        const response = await apiService.get('/invitation/invitation-list/itinerary-1');
        setInvitationList(response.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown');
      } finally {
        setLoading(false);
      }
    }

    fetchInvitations();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <InvitationTable
      itineraryUUID={invitationList?.itineraryUUID || ''}
      itineraryPartySize={invitationList?.itineraryPartySize || 0}
      invitations={invitationList?.invitations || []}
    />
  );
}

export default InvitationListView;
