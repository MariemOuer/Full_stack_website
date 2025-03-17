import { Invitation } from "../models/invitation";

type InvitationTableProps = {
  itineraryUUID: string;
  itineraryPartySize: number;
  invitations: Invitation[];
};

const InvitationTable: React.FC<InvitationTableProps> = ({ itineraryUUID, itineraryPartySize, invitations }) => {
  return (
    <div>
      <h2>Guest List</h2>

      <div>
        <a href="#" className="hover:underline">
          Add/Remove Guest
        </a>
        <a href="#" className="hover:underline">
          Send Reminder To Pending Guests
        </a>
      </div>

      <table>
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
          {invitations.map((guest) => (
            <tr key={guest.id}>
              <td>{new Date(guest.rsvpDeadline).toLocaleDateString()}</td>
              <td>{guest.name}</td>
              <td>
                <a href={`mailto:${guest.email}`}>{guest.email}</a>
              </td>
              <td>2</td>
              <td>{guest.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvitationTable;
