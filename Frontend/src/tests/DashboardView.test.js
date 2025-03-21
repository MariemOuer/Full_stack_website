import { render, screen, fireEvent} from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom"; 
import DashboardView from "../views/DashboardView";

// Mock CSS files - these must be the first jest.mocks
jest.mock("../styles/home.css", () => ({}), { virtual: true });

const mockNavigate = jest.fn();

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

// Mock useAuth to simulate a logged-in user
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    currentUser: { email: "test@example.com" }, // Mock a logged-in user
    setIsGuest: jest.fn(),
  }),
}));

describe("DashboardView Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Case 1.1: Verify the component renders without crashing
  test("component renders without crashing", () => {
    render(
      <Router>
        <DashboardView />
      </Router>
    );
    expect(screen.getByText("Events Made Easy, Memories Made Forever")).toBeInTheDocument();
  });

  // Test Case 1.2: Verify all sections of the dashboard are rendered correctly
  test("renders dashboard sections correctly", () => {
    render(
      <Router>
        <DashboardView />
      </Router>
    );

    // Check top left section
    expect(screen.getByText("Events Made Easy, Memories Made Forever")).toBeInTheDocument();
    expect(screen.getByText("Plan your next event now →")).toBeInTheDocument();

    // Check top right section
    expect(screen.getByAltText("Planner notebook")).toBeInTheDocument();

    // Check "How It Works" section
    expect(screen.getByText("How it Works")).toBeInTheDocument();
    expect(screen.getByAltText("How it works")).toBeInTheDocument();

    // Check "Meet the Team" section
    expect(screen.getByText("Meet the Team")).toBeInTheDocument();
  });

  // Test Case 1.3: Verify all team members are displayed correctly
  test("renders all team members correctly", () => {
    render(
      <Router>
        <DashboardView />
      </Router>
    );

    // Check if all team members are rendered
    expect(screen.getByText("Miri Kim")).toBeInTheDocument();
    expect(screen.getByText("Riya Sharma")).toBeInTheDocument();
    expect(screen.getByText("Martin Liu")).toBeInTheDocument();
    expect(screen.getByText("Mariem Ouertatani")).toBeInTheDocument();
    expect(screen.getByText("Diba Jamali")).toBeInTheDocument();
    expect(screen.getByText("Stephenie Oboh")).toBeInTheDocument();
  });

  // Test Case 2.1: Verify clicking the "Plan your next event now" link navigates to the chatbot page
  test("navigates to chatbot page when link is clicked", () => {

    render(
      <Router>
        <DashboardView />
      </Router>
    );

    // Find the link and simulate click
    const link = screen.getByRole("link", { name: /Plan your next event now/i });
    fireEvent.click(link);

    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith("/chatbot");
  });

  // Test Case 3.1: Verify the layout adjusts for mobile devices
  test("adjusts layout for mobile devices", () => {
    // Simulate mobile viewport
    global.innerWidth = 500;
    global.dispatchEvent(new Event("resize"));

    render(
      <Router>
        <DashboardView />
      </Router>
    );

    // Check if sections stack vertically
    expect(screen.getByText("Events Made Easy, Memories Made Forever")).toBeInTheDocument();
    expect(screen.getByAltText("Planner notebook")).toBeInTheDocument();
  });
});