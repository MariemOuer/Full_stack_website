import React, { useState } from "react";
import { useAuthController } from "../controllers/AuthController";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

const LoginView = () => {
  const { loginWithEmail } = useAuthController();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      navigate("/");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="auth-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin} className="auth-form">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="auth-buttons">
              <p className="register-link">
                Don't have an account?{" "}
                <span className="register-here">
                  <Link to="/signup">Register Here</Link>
                </span>
              </p>
              <button type="submit">Login</button>
            </div>

            {errorMsg && <p className="error">{errorMsg}</p>}
          </form>
        </div>

        <img
          src="/loginwoman.png"
          alt="Login Illustration"
          className="login-image"
        />
      </div>
    </div>
  );
};

export default LoginView;