// src/views/SignupView.jsx
import React, { useState } from "react";
import { useAuthController } from "../controllers/AuthController";
import { Link, useNavigate } from "react-router-dom";
import "../styles/main.css";
import "../styles/signup.css";

const SignupView = () => {
  const { signupWithEmail } = useAuthController();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
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
      await signupWithEmail(email, password, { firstName, lastName, phone });
      navigate("/");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    //html for signup
    <div className="signup-page">
      <div className="auth-container">
        <h2>Signup</h2>
        <form onSubmit={handleSignup} className="auth-form">
          <input type="text" placeholder="First Name" value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
          <input type="text" placeholder="Last Name" value={lastName} onChange={(event) => setLastName(event.target.value)} required />
          <input type="tel" placeholder="Phone Number" value={phone} onChange={(event) => setPhone(event.target.value)} required />
          <input type="email" placeholder="Email Address" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <input type="password" placeholder="Confirm Password" value={confirmPwd} onChange={(event) => setConfirmPwd(event.target.value)} required />
          <button type="submit">Register</button>
          {errorMsg && <p className="error">{errorMsg}</p>}
        </form>

        <p className="registered-message">
          Already Registered? <Link to="/login">Login Here</Link>
        </p>
      </div>

      <div className="signup-img-container">
      <img src="/signup.png" alt="Signup Illustration" className="signup-image" />
      </div>
    </div>
  );
};

export default SignupView;
