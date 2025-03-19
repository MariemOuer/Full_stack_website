import React, { useState } from "react";
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
        <div className="button-wrapper">
          <PrimaryButton text="Invite Guests" />
        </div>
      </div>
    </div>
  );
};

const InvitationForm = () => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [rsvpBy, setRsvpBy] = useState("");
  const [plusOnes, setPlusOnes] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  return (
    <form className="form">
      <input type="text" placeholder="Occasion" className="input" />
      <input type="text" placeholder="Theme" className="input" />
      <input type="text" placeholder="Venue" className="input" />
      <input
        type={focusedField === "date" || date ? "date" : "text"}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        onFocus={() => setFocusedField("date")}
        onBlur={() => setFocusedField(null)}
        placeholder="Date"
        className="input"
      />
      <input
        type={focusedField === "startTime" || startTime ? "time" : "text"}
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        onFocus={() => setFocusedField("startTime")}
        onBlur={() => setFocusedField(null)}
        placeholder="Start Time"
        className="input"
      />
      <input
        type={focusedField === "rsvpBy" || rsvpBy ? "date" : "text"}
        value={rsvpBy}
        onChange={(e) => setRsvpBy(e.target.value)}
        onFocus={() => setFocusedField("rsvpBy")}
        onBlur={() => setFocusedField(null)}
        placeholder="RSVP By"
        className="input"
      />
      <input
        type="number"
        value={plusOnes}
        onChange={(e) => setPlusOnes(e.target.value)}
        onFocus={() => setFocusedField("plusOnes")}
        onBlur={() => setFocusedField(null)}
        placeholder="PlusOnes"
        className="input"
      />
      <div className="button-wrapper">
        <PrimaryButton text="Create" />
      </div>
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

const PrimaryButton = ({ text }) => {
  return <button className="button">{text}</button>;
};

export default CreateInvitationPage;
