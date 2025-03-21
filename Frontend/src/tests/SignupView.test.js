import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

import SignupView from "../views/SignupView";

// Mock CSS files - these must be the first jest.mocks
jest.mock("../styles/main.css", () => ({}), { virtual: true });
jest.mock("../styles/signup.css", () => ({}), { virtual: true });

// Create mock functions first
const mockNavigate = jest.fn();
const mockSetIsGuest = jest.fn();
const mockSignupWithEmail = jest.fn().mockResolvedValue(true);

// Mock modules with explicit references to our mock functions
jest.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: ({ children }) => children,
  useNavigate: () => mockNavigate,
  Link: ({ to, children, ...props }) => (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault(); // Prevent default anchor behavior
        mockNavigate(to); // Simulate navigation
      }}
      {...props}
    >
      {children}
    </a>
  ),
  Outlet: () => null,
}));

jest.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    currentUser: null,
    setIsGuest: mockSetIsGuest,
  }),
}));

jest.mock("../controllers/AuthController", () => ({
  useAuthController: () => ({
    signupWithEmail: mockSignupWithEmail,
  }),
}));

// Mock DashboardView to call navigate('/login') when rendered
jest.mock("../views/DashboardView", () => {
  const React = jest.requireActual("react"); // Import React dynamically
  return function MockDashboardView() {
    const navigate = require("react-router-dom").useNavigate();
    React.useEffect(() => {
      navigate("/login");
    }, [navigate]);
    return <div>Dashboard</div>;
  };
});

// Basic test suite for SignupView
describe("SignupView Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Simple smoke test to verify the component can render
  test("component renders without crashing", () => {
    expect(() => render(<SignupView />)).not.toThrow();
  });

  // Test the mock functions directly
  test("mock functions work correctly", () => {
    // Test navigation
    mockNavigate("/");
    expect(mockNavigate).toHaveBeenCalledWith("/");

    // Test signup function
    mockSignupWithEmail("test@example.com", "password123", {
      firstName: "John",
      lastName: "Doe",
      phone: "1234567890",
    });
    expect(mockSignupWithEmail).toHaveBeenCalledWith(
      "test@example.com",
      "password123",
      { firstName: "John", lastName: "Doe", phone: "1234567890" }
    );

    // Test setting guest flag
    mockSetIsGuest(true);
    expect(mockSetIsGuest).toHaveBeenCalledWith(true);
  });

  // Test Case 1.1: Successful Signup with Valid Credentials
  test("should sign up successfully with valid credentials and redirect to dashboard", async () => {
    render(<SignupView />);

    // Get elements using more specific selectors
    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const phoneInput = screen.getByPlaceholderText("Phone Number");
    const emailInput = screen.getByPlaceholderText("Email Address");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const registerButton = screen.getByRole("button", { name: /register/i });

    // Fill in the form fields
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });

    // Click the register button
    fireEvent.click(registerButton);

    // Wait for the signup process to complete
    await waitFor(() => {
      expect(mockSignupWithEmail).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        { firstName: "John", lastName: "Doe", phone: "1234567890" }
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  // Test Case 1.2: Failed Signup with Invalid Credentials
  test("should display an error message when signup fails with invalid credentials", async () => {
    // Setup mock to simulate signup failure
    mockSignupWithEmail.mockRejectedValueOnce(new Error("Email already in use"));

    render(<SignupView />);

    // Get elements using more specific selectors
    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const phoneInput = screen.getByPlaceholderText("Phone Number");
    const emailInput = screen.getByPlaceholderText("Email Address");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const registerButton = screen.getByRole("button", { name: /register/i });

    // Fill in the form fields
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });

    // Click the register button
    fireEvent.click(registerButton);

    // Check that the signup function was called
    await waitFor(() => {
      expect(mockSignupWithEmail).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        { firstName: "John", lastName: "Doe", phone: "1234567890" }
      );
    });

    // Check that the error message is displayed
    await waitFor(() => {
      expect(screen.getByText("Email already in use")).toBeInTheDocument();
    });
  });

  // Test Case 1.3: Form Validation (Mismatched Passwords)
  test("should display an error message when passwords do not match", () => {
    render(<SignupView />);

    // Get elements using more specific selectors
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const registerButton = screen.getByRole("button", { name: /register/i });

    // Fill in mismatched passwords
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password456" } });

    // Click the register button
    fireEvent.click(registerButton);

    // Check that the error message is displayed
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });

  // Test Case 2.1: Navigation to Login Page
  test("should navigate to the login page when the login link is clicked", () => {
    render(<SignupView />);

    // Find the login link
    const loginLink = screen.getByRole("link", { name: /login here/i });

    // Simulate clicking the login link
    fireEvent.click(loginLink);

    // Verify navigation to the login page
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});