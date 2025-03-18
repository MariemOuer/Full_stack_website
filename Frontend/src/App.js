import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./views/NavbarView";
import FooterView from "./views/FooterView";
import LoginView from "./views/LoginView";
import SignupView from "./views/SignupView";
import HomepageView from "./views/HomepageView";
import InvitationListView from "./views/InvitationListView";

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
          <Route path="/invitation-list" element={<InvitationListView />} />
          <Route path="/home" element={<HomepageView />} />

          {/* Private Routes (only if logged in or guest) */}
          <Route path="/" element={currentUser || isGuest ? <HomepageView /> : <Navigate to="/login" />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      <FooterView />
    </Router>
  );
}

export default App;
