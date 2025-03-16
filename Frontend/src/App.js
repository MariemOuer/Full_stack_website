import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./Views/NavbarView";
import FooterView from "./Views/FooterView"; 
import LoginView from "./Views/LoginView";
import SignupView from "./Views/SignupView";
import DashboardView from "./Views/DashboardView";
import UsersView from "./Views/UsersView";

function App() {
  const { currentUser, isGuest } = useAuth();

  return (
    <Router>
      <Navbar />

      <div className="content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!currentUser && !isGuest ? <LoginView /> : <Navigate to="/" />} />
          <Route path="/signup" element={!currentUser && !isGuest ? <SignupView /> : <Navigate to="/" />} />

          {/* Private Routes (only if logged in or guest) */}
          <Route path="/" element={currentUser || isGuest ? <DashboardView /> : <Navigate to="/login" />} />
          <Route path="/dogs" element={currentUser ? <UsersView /> : <Navigate to="/login" />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      <FooterView />
    </Router>
  );
}

export default App;
