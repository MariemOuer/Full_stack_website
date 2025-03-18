import React, { useState } from "react";
import { Invitation } from "../models/invitation";
import "../styles/invitation_table.css";

type InvitationTableProps = {
  itineraryUUID: string;
  itineraryPartySize: number;
  invitations: Invitation[];
};

const InvitationTable: React.FC<InvitationTableProps> = ({ itineraryUUID, itineraryPartySize, invitations }) => {
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);
  const [openAddGuest, setOpenAddGuest] = useState(false);

  const togglePopup = () => {
    setOpenAddGuest(!openAddGuest);
  };

  const handleRowClick = (guestId: string) => {
    setSelectedGuest(selectedGuest === guestId ? null : guestId);
  };

  return (
    <div className="invite-table-component">
      <h2 className="page-header">Guest List</h2>

      <div className="invite-table-options">
        <a href="#" className="hover:underline" onClick={togglePopup}>
          Add Guest
        </a>
        <a href="#" className="hover:underline">
          Send Reminder To Pending Guests
        </a>
      </div>

      <table className="invite-table">
        <thead>
          <tr className="invite-table-header">
            <th>RSVP Date</th>
            <th>Name</th>
            <th>Email</th>
            <th>Party Of</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {invitations.map((guest) => (
            <React.Fragment key={guest.id}>
              <tr onClick={() => handleRowClick(guest.id.toString())}>
                <td>{new Date(guest.rsvpDeadline).toLocaleDateString()}</td>
                <td>{guest.name}</td>
                <td>
                  <a href={`mailto:${guest.email}`}>{guest.email}</a>
                </td>
                <td>2</td>
                <td>{guest.status}</td>
                <td>
                  <img src="./trash-red.png" alt="trashcan" className="trash-red" />
                </td>
              </tr>
              {selectedGuest === guest.id.toString() && (
                <tr className="dropdown-row">
                  <td colSpan={6}>
                    <div className="dropdown-content">
                      <div className="dropdown-content-row">
                        <div>
                          <span className="dropdown-content-header">Email</span>
                          <a href={`mailto:${guest.email}`}>{guest.email}</a>
                        </div>
                        <div>
                          <span className="dropdown-content-header">Party Of</span>2
                        </div>
                      </div>
                      <div className="dropdown-content-row">
                        <div>
                          <span className="dropdown-content-header">Status</span>
                          {guest.status}
                        </div>
                        <div>
                          <img src="./trash-red.png" alt="trashcan" className="trash-red" />
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
    </div>
  );
};

export default InvitationTable;
