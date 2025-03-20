import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginView from "./views/LoginView";
import SignupView from "./views/SignupView";
import DashboardView from "./views/DashboardView";
import EditGuestListView from "./views/EditGuestListView";
import InvitationView from "./views/InvitationView";
import ChatBotView from "./views/ChatbotView";
import SavedEventsView from "./views/SavedEventsView";
import Navbar from "./views/NavbarView";
import FooterView from "./views/FooterView";

function AppContent() {
  const { currentUser, isGuest } = useAuth();
  const navigate = useNavigate();
  const currentPath = window.location.pathname; // Get current URL path

  useEffect(() => {
    if (!currentUser && !isGuest && currentPath !== "/signup") {
      // navigate("/login");
    }
  }, [currentUser, isGuest, navigate, currentPath]);

  return (
    <>
      <Navbar />
      <div className="content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!currentUser && !isGuest ? <LoginView /> : <Navigate to="/" />} />
          <Route path="/signup" element={!currentUser && !isGuest ? <SignupView /> : <Navigate to="/" />} />

          {/* Other accessible pages */}
          <Route path="/view-invitation/:eventId" element={<InvitationView />} />
          <Route path="/chatbot" element={<ChatBotView />} />
          <Route path="/saved-events" element={<SavedEventsView />} />
          <Route path="/edit-guest-list/:eventId" element={<EditGuestListView />} />

          {/* Private Routes (Only If Logged In or Guest) */}
          <Route path="/" element={currentUser || isGuest ? <DashboardView /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      <FooterView />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
