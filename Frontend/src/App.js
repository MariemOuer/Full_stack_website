import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./views/NavbarView";
import FooterView from "./views/FooterView";
import LoginView from "./views/LoginView";
import SignupView from "./views/SignupView";
import HomepageView from "./views/HomepageView";
import InvitationListView from "./views/InvitationListView";
import SavedEventsView from "./views/SavedEventsView";
import ChatbotView from "./views/ChatbotView";
import InvitationView from "./views/InvitationView";
import CreateInvitationView from "./views/CreateInvitationView";
import "./styles/main.css";

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
          <Route path="/invitation-list" element={<InvitationListView />} />
          <Route path="/chat-bot" element={<ChatbotView />} />
          <Route path="/home" element={<HomepageView />} />
          <Route path="/saved-events" element={<SavedEventsView />} />
          <Route path="/invitation" element={<InvitationView />} />
          <Route path="/create-invitation" element={<CreateInvitationView />} />

          {/* Private Routes (Only If Logged In or Guest) */}
          <Route path="/" element={currentUser || isGuest ? <HomepageView /> : <Navigate to="/login" />} />
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
