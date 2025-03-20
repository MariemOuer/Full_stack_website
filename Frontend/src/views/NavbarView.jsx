// src/views/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import "../styles/navbar.css"; // Import CSS for styling
import { checkIfCurrentUserIsGuest } from "../utils/GuestHelpers";

const Navbar = () => {
  const { currentUser, logout, isGuest } = useAuth(); // Get current user & logout function

  const handleLogout = async () => {
    try {
      await logout();

      // Optionally, redirect to the login page or show a success message
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
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
          <h2 style={{ color: "red" }}>Occasio AI</h2>
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
