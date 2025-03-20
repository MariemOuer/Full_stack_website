import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext"; 
import NavbarView from "../views/NavbarView"; 

jest.mock("../context/AuthContext");

describe("NavbarView", () => {
  it("should render the NavbarView with Login link when the user is not logged in", () => {
    useAuth.mockReturnValue({ currentUser: null });

    render(
      <Router>
        <NavbarView />
      </Router>
    );

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
  });

  it("should render the NavbarView with Logout button when a regular user is logged in", () => {
    useAuth.mockReturnValue({ currentUser: { email: "user@example.com" } });

    render(
      <Router>
        <NavbarView />
      </Router>
    );

    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    expect(screen.getByText(/user@example.com/i)).toBeInTheDocument();
  });

  it("should render the NavbarView with Logout button when a guest user is logged in", () => {
    useAuth.mockReturnValue({ currentUser: { email: "guest@example.com" }, isGuest: true });

    render(
      <Router>
        <NavbarView />
      </Router>
    );

    expect(screen.getByText(/Guest/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  it("should call logout function when the Logout button is clicked", () => {
    const mockLogout = jest.fn();
    useAuth.mockReturnValue({ currentUser: { email: "user@example.com" }, logout: mockLogout });

    render(
      <Router>
        <NavbarView />
      </Router>
    );

    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("should render the NavbarView links and buttons correctly", () => {
    render(
      <Router>
        <NavbarView />
      </Router>
    );

    expect(screen.getByText(/Chat Prompt/i)).toBeInTheDocument();
    expect(screen.getByText(/View Events/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it("should not display the 'Login' button if the user is logged in", () => {
    useAuth.mockReturnValue({ currentUser: { email: "user@example.com" } });

    render(
      <Router>
        <NavbarView />
      </Router>
    );

    expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
  });
});
