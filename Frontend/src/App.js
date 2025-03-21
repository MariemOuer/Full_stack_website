import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginView from "./views/LoginView";
import SignupView from "./views/SignupView";
import DashboardView from "./views/DashboardView";
import EditGuestListView from "./views/EditGuestListView";
import InvitationView from "./views/InvitationView";
import ChatBotView from "./views/ChatbotView";
import SavedEventsView from "./views/SavedEventsView";

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!currentUser ? <LoginView /> : <Navigate to="/" />} />
        <Route path="/signup" element={!currentUser ? <SignupView /> : <Navigate to="/" />} />

        {/* Private Routes (only if logged in) */}
        <Route path="/" element={currentUser ? <DashboardView /> : <Navigate to="/login" />} />
        <Route path="/chatbot" element={currentUser ? <ChatBotView /> : <Navigate to="/login" />} />
        <Route path="/events" element={currentUser ? <SavedEventsView /> : <Navigate to="/login" />} />
        <Route path="/view-invitation/:eventId" element={currentUser ? <InvitationView /> : <Navigate to="/login" />} />
        <Route path="/edit-guest-list/:eventId" element={currentUser ? <EditGuestListView /> : <Navigate to="/login" />} />
        {/* <Route path="/edit-event-details/:eventId" element={currentUser ? <EditEventDetailsView /> : <Navigate to="/login" />} /> */}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
