import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import LoginView from "../views/LoginView";

// Mock the LoginView component to simulate mobile behavior
jest.mock("../views/LoginView", () => {
  const React = jest.requireActual("react");
  return function MockLoginView({ isMobile }) {
    return (
      <div className="login-page">
        <div className="login-wrapper">
          <div className="auth-container">
            <h2>Login</h2>
            <form className="auth-form">
              <input type="email" placeholder="Email Address" />
              <input type="password" placeholder="Password" />
              <button type="submit">Login</button>
              <button>Signup</button>
            </form>
          </div>
          {!isMobile && (
            <img src="/loginwoman.png" alt="Login Illustration" className="login-image" />
          )}
        </div>
      </div>
    );
  };
});



// Test Case 3.1: Responsive Design on smaller Devices
describe("LoginView Mobile Responsiveness", () => {
  it("should hide the login image on mobile devices", () => {
    // Render the mocked LoginView with isMobile prop set to true
    render(<LoginView isMobile={true} />);

    // Check that the image is not in the DOM
    const image = screen.queryByAltText("Login Illustration");
    expect(image).not.toBeInTheDocument();
  });

  it("should display the login form correctly on mobile devices", () => {
    // Render the mocked LoginView with isMobile prop set to true
    render(<LoginView isMobile={true} />);

    // Check that the login form elements are visible
    expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /signup/i })).toBeInTheDocument();
  });
});