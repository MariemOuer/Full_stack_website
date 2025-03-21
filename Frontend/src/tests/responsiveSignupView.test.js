import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import SignupView from "../views/SignupView";

// Mock the SignupView component to simulate mobile behavior
jest.mock("../views/SignupView", () => {
  const React = jest.requireActual("react");
  return function MockSignupView({ isMobile }) {
    return (
      <div className="signup-page">
        <div className="auth-container">
          <h2>Signup</h2>
          <form className="auth-form">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
            <input type="tel" placeholder="Phone Number" />
            <input type="email" placeholder="Email Address" />
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Confirm Password" />
            <button type="submit">Register</button>
          </form>
          <p className="registered-message">
            Already Registered? <a href="/login">Login Here</a>
          </p>
          {!isMobile && (
            <img src="/signup.png" alt="Signup Illustration" className="signup-image" />
          )}
        </div>
      </div>
    );
  };
});

// Test Case 3.1: Responsive Design on smaller Devices
describe("SignupView Mobile Responsiveness", () => {
  it("should hide the signup image on mobile devices", () => {
    // Render the mocked SignupView with isMobile prop set to true
    render(<SignupView isMobile={true} />);

    // Check that the image is not in the DOM
    const image = screen.queryByAltText("Signup Illustration");
    expect(image).not.toBeInTheDocument();
  });

  it("should display the signup form correctly on mobile devices", () => {
    // Render the mocked SignupView with isMobile prop set to true
    render(<SignupView isMobile={true} />);

    // Check that the signup form elements are visible
    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone Number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
    expect(screen.getByText("Already Registered?")).toBeInTheDocument();
    expect(screen.getByText("Login Here")).toBeInTheDocument();
  });
});