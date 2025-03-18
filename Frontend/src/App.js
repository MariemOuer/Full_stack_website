// src/App.js
// import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginView from "./views/LoginView";
import SignupView from "./views/SignupView";
import DashboardView from "./views/DashboardView";
import UsersView from "./views/UsersView";
import InvitationListView from "./views/invitation_list_view";
import HomepageView from "./views/HomepageView";

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!currentUser ? <LoginView /> : <Navigate to="/" />} />
        <Route path="/signup" element={!currentUser ? <SignupView /> : <Navigate to="/" />} />
        <Route path="/invitation-list" element={<InvitationListView />} />
        <Route path="/home" element={<HomepageView />} />

        {/* Private Routes (only if logged in) */}
        <Route path="/" element={currentUser ? <DashboardView /> : <Navigate to="/login" />} />
        <Route path="/dogs" element={currentUser ? <UsersView /> : <Navigate to="/login" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
