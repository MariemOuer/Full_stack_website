// src/views/LoginView.jsx
import React, { useState } from "react";
import { useAuthController } from "../controllers/AuthController";
import { Link } from "react-router-dom";
import "../styles/main.css";

const LoginView = () => {
  const { loginWithEmail } = useAuthController();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      // On success, you should be redirected to "/"
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        {errorMsg && <p className="error">{errorMsg}</p>}
      </form>

      <div style={{ marginTop: "10px" }}>
        <p>
          Don’t have an account? <Link to="/signup">Sign up here</Link>.
        </p>
      </div>
    </div>
  );
};

export default LoginView;
