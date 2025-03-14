// src/views/NavbarView.jsx

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import "../styles/navbar.css"; 

const Navbar = () => {
  const { currentUser, isGuest } = useAuth(); 

  const username = isGuest 
    ? "Guest" 
    : currentUser?.displayName || "User"; 

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/chat-prompt">Chat Prompt</Link>
        <Link to="/create-invitation">Create Invitation</Link>
        <Link to="/invite-guests">Invite Guests</Link>
      </div>

      <div className="nav-center">
        <h2>Occasio</h2>
      </div>

      <div className="nav-right">
        <span className="user-account"> {username} </span>
        <img src="/userlogo.png" alt="User Icon" className="user-icon" />
      </div>
    </nav>
  );
};

export default Navbar;
