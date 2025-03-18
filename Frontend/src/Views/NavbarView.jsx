import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import "../styles/navbar.css"; 

const Navbar = () => {
  
  const { currentUser, isGuest, logout } = useAuth();
  const location = useLocation(); 

  const username = isGuest 
    ? "Guest" 
    : currentUser?.email || "User"; 

  /* Check if the user is on login or signup pages*/
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <nav className={`navbar ${isAuthPage ? "auth-page" : ""}`}>
      {/* Show left & right sections only on non-auth pages */}
      {!isAuthPage && (
        <div className="nav-left">
          <Link to="/chat-prompt">Chat Prompt</Link>
          <Link to="/create-invitation">Create Invitation</Link>
          <Link to="/invite-guests">Invite Guests</Link>
        </div>
      )}

      {/* Center section always visible */}
      <div className="nav-center">
        <h2>Occasio</h2>
      </div>

      {/* Show right section only on non-auth pages */}
      {!isAuthPage && (
        <div className="nav-right">
          <span className="user-account"> {username} </span>
          <img src="/userlogo.png" alt="User Icon" className="user-icon" />
          <button onClick={logout}>Logout</button>

        </div>
      )}
    </nav>
  );
};

export default Navbar;
