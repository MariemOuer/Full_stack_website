import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

const FooterView = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Occasio</h3>
          <p>
            <strong>Contact Us</strong>
          </p>
          <p>occasio.planner@gmail.com</p>
        </div>

        <div className="footer-section">
          <p>
            <strong>Navigation</strong>
          </p>
          <Link to="/chat-prompt">Chat Prompt</Link>
          <Link to="/create-invitation">Create Invitation</Link>
          <Link to="/invite-guests">Invite Guests</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>2025. Occasio. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default FooterView;
