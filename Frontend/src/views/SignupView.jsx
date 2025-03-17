// src/views/SignupView.jsx
import React, { useState } from "react";
import { useAuthController } from "../controllers/AuthController";
import { Link } from "react-router-dom";
import "../styles/main.css";

const SignupView = () => {
  const { signupWithEmail } = useAuthController();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPwd) {
      setErrorMsg("Passwords do not match");
      return;
    }
    try {
      await signupWithEmail(email, password);
      // On success, user is created & automatically logged in.
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} className="auth-form">
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

        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>

        {errorMsg && <p className="error">{errorMsg}</p>}
      </form>

      <div style={{ marginTop: "10px" }}>
        <p>
          Already have an account? <Link to="/login">Log in here</Link>.
        </p>
      </div>
    </div>
  );
};

export default SignupView;
