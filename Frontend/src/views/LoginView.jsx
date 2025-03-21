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
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await loginWithEmail(email, password);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleGuestLogin = async (e) => {
    e.preventDefault();
    try {
      await loginAsGuest();
      setIsGuest(true);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message);
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
            <input type="email" placeholder="Email Address" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <p className="guest-login">
              <a href="/" onClick={handleGuestLogin}>
                Continue as Guest
              </a>
            </p>
            <div className="auth-buttons">
              <button type="submit" className="login-button">
                Login
              </button>
              <button className="signup-button" onClick={handleSignupClick}>
                Signup
              </button>
            </div>

            {errorMessage && <p className="error">{errorMessage}</p>}
          </form>
        </div>

        <img src="/loginwoman.png" alt="Login Illustration" className="login-image" />
      </div>
    </div>
  );
};

export default LoginView;
