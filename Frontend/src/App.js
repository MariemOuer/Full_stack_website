// src/App.js
// import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginView from "./Views/LoginView";
import SignupView from "./Views/SignupView";
import DashboardView from "./Views/DashboardView";
import UsersView from "./Views/UsersView";
import HomepageView from "./Views/HomepageView";


function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/home"
          element={!currentUser ? <HomepageView /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!currentUser ? <LoginView /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!currentUser ? <SignupView /> : <Navigate to="/" />}
        />

        {/* Private Routes (only if logged in) */}
        <Route
          path="/"
          element={currentUser ? <DashboardView /> : <Navigate to="/home" />}
        />
        <Route
          path="/dogs"
          element={currentUser ? <UsersView /> : <Navigate to="/home" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;
