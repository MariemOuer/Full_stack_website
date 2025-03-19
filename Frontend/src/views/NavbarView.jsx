import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

const Navbar = () => {
  const { currentUser, isGuest, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle menu

  const username = isGuest ? "Guest" : currentUser?.email || "User";

  /* Check if the user is on login or signup pages*/
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <nav className={`navbar ${isAuthPage ? "auth-page" : ""}`}>
      {/* Mobile Toggle Button */}
      {!isAuthPage && (
        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      )}

      {/* Desktop Navigation */}
      {!isAuthPage && (
        <div className="nav-left">
          <Link to="/chat-bot">Chat Prompt</Link>
          <Link to="/create-invitation">Create Invitation</Link>
          <Link to="/invitation-list">Invite Guests</Link>
        </div>
      )}

      {/* Center Logo */}
      <div className="nav-center">
        <h2>Occasio</h2>
      </div>

      {/* Right Section with Logout */}
      {!isAuthPage && (
        <div className="nav-right">
          <span className="user-account">{username}</span>
          <img src="/userlogo.png" alt="User Icon" className="user-icon" />
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      )}

      {/* Mobile Dropdown Menu */}
      {!isAuthPage && menuOpen && (
        <div className="mobile-dropdown">
          <Link to="/chat-bot" onClick={() => setMenuOpen(false)}>
            Chat Prompt
          </Link>
          <Link to="/create-invitation" onClick={() => setMenuOpen(false)}>
            Create Invitation
          </Link>
          <Link to="/invitation-list" onClick={() => setMenuOpen(false)}>
            Invite Guests
          </Link>
          <button
            onClick={() => {
              setMenuOpen(false);
              logout();
            }}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
