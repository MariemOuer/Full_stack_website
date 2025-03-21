import React, { useState } from "react";
import { useAuthController } from "../controllers/AuthController";
import { Link, useNavigate } from "react-router-dom";
import "../styles/main.css";
import "../styles/login.css";
import { useAuth } from "../context/AuthContext";

const LoginView = () => {
  const { loginWithEmail, loginAsGuest, currentUser } = useAuthController();
  const { setIsGuest } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await loginWithEmail(email, password);
      navigate("/");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleGuestLogin = async (e) => {
    e.preventDefault(); // Prevents link from redirecting immediately
    try {
      await loginAsGuest();
      setIsGuest(true); // Set guest mode
      navigate("/"); // Redirect after successful guest login
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="auth-container">
          <h2>Login</h2>
          {currentUser && (
            <p>
              <strong>Email Address:</strong> {currentUser.email || "Loading..."}
            </p>
          )}
          <form onSubmit={handleLogin} className="auth-form">
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <p className="guest-login">
              <a href="/" onClick={handleGuestLogin}>
                Continue as Guest
              </a>
            </p>
            <div className="auth-buttons">
              <button type="submit">Login</button>
              <button className="signup-button">
                <Link to="/signup" className="signup-link">
                  Signup
                </Link>
              </button>
            </div>

            {errorMsg && <p className="error">{errorMsg}</p>}
          </form>
        </div>

        <img src="/loginwoman.png" alt="Login Illustration" className="login-image" />
      </div>
    </div>
  );
};

export default LoginView;
