// src/views/DashboardView.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const DashboardView = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <p>Welcome, {currentUser?.email || "User"}!</p>

      <button onClick={logout}>Logout</button>

      <nav style={{ marginTop: "20px" }}>
        <Link to="/">Home</Link> | <Link to="/dogs">Dog Page</Link>
      </nav>
    </div>
  );
};

export default DashboardView;
