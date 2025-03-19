import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginView from "./Views/LoginView";
import SignupView from "./Views/SignupView";
import DashboardView from "./Views/DashboardView";
import ViewInvitationView from "./Views/ViewInvitationView";
import EditGuestListView from "./Views/EditGuestListView";
import EditEventDetailsView from "./Views/EditEventDetailsView";
import ChatBotView from "./Views/ChatbotView";
import SavedEventsView from "./Views/SavedEventsView";

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
        <Route path="/view-invitation/:eventId" element={currentUser ? <ViewInvitationView /> : <Navigate to="/login" />} />
        <Route path="/edit-guest-list/:eventId" element={currentUser ? <EditGuestListView /> : <Navigate to="/login" />} />
        <Route path="/edit-event-details/:eventId" element={currentUser ? <EditEventDetailsView /> : <Navigate to="/login" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
