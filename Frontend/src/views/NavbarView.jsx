import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

const Navbar = () => {
  const { currentUser, isGuest, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate(); // Add the navigate hook
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const username = isGuest ? "Guest" : currentUser?.email || "User";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  // Handle logout with redirect
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to login page after successful logout
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && dropdownRef.current && !dropdownRef.current.contains(event.target) && !event.target.classList.contains("nav-toggle") && !event.target.classList.contains("hamburger-line")) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, menuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`navbar ${isAuthPage ? "auth-page" : ""}`}>
      {/* Main navbar container */}
      <div className="navbar-container">
        {/* Mobile Toggle Button */}
        {!isAuthPage && (
          <button className={`nav-toggle ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        )}

        {/* Desktop Navigation Links */}
        <div className="nav-left desktop-only">
          <Link to="/chat-bot" className="nav-link">
            Chat Prompt
          </Link>
          <Link to="/create-invitation" className="nav-link">
            Create Invitation
          </Link>
          <Link to="/invitation-list" className="nav-link">
            Invite Guests
          </Link>
        </div>

        {/* Center Logo */}
        <div className="nav-center">
          <Link to="/" className="home-link">
            <h2>Occasio</h2>
          </Link>
        </div>
        {/* Right Section with User Info and Logout */}
        {!isAuthPage && (
          <div className="nav-right desktop-only">
            <div className="user-info">
              <span className="user-account">{username}</span>
              <img src="/userlogo.png" alt="User" className="user-icon" />
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {!isAuthPage && (
        <div ref={dropdownRef} className={`mobile-dropdown ${menuOpen ? "open" : ""}`}>
          <div className="mobile-dropdown-content">
            <Link to="/chat-bot" className="mobile-link">
              Chat Prompt
            </Link>
            <Link to="/create-invitation" className="mobile-link">
              Create Invitation
            </Link>
            <Link to="/invitation-list" className="mobile-link">
              Invite Guests
            </Link>
            <div className="mobile-user-info">
              <img src="/userlogo.png" alt="User" className="mobile-user-icon" />
              <span className="mobile-user-account">{username}</span>
            </div>
            <button onClick={handleLogout} className="mobile-logout-button">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
