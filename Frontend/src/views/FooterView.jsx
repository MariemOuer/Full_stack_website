import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

const FooterView = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h3>Occasio</h3>

        <div className="footer-lower">
          <div className="footer-section">
            <p>
              <strong>Contact Us</strong>
            </p>
            <p>occasio.planner@gmail.com</p>
          </div>

          <div className="footer-section">
            <p>
              <strong>Navigation</strong>
            </p>
            <Link to="/chatbot">Chat Prompt</Link>
            <Link to="/events">Create Invitation</Link>
            <Link to="/events">Invite Guests</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>2025. Occasio. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default FooterView;
