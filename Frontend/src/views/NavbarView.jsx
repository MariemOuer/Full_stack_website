// src/views/NavbarView.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import "../styles/navbar.css"; // Import CSS for styling
import { checkIfCurrentUserIsGuest } from "../utils/GuestHelpers";

const Navbar = () => {
  const { currentUser, logout, isGuest } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      {/* Mobile Menu Toggle */}
      <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        &#9776;
      </button>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/chatbot" onClick={() => setIsMobileMenuOpen(false)}>
            Chat Prompt
          </Link>
          <Link to="/events" onClick={() => setIsMobileMenuOpen(false)}>
            View Events
          </Link>
          {currentUser ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}

      {/* Desktop Navbar */}
      <div className="nav-left">
        <Link to="/chatbot">Chat Prompt</Link>
        <Link to="/events">View Events</Link>
        {currentUser && (
          <button className="logout-btn" onClick={handleLogout}>
            {isGuest ? "Login" : "Logout"}
          </button>
        )}
      </div>
      <div className="nav-center">
        <Link to="/home" style={{ textDecoration: "none" }}>
          <h2 className="nav-title">Occasio</h2>
        </Link>
      </div>
      <div className="nav-right">
        {currentUser ? (
          <>
            👤 {checkIfCurrentUserIsGuest(currentUser) ? "Guest" : currentUser?.email}
            <button className="hide" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
