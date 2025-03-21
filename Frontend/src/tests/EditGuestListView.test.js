import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditGuestListView from "../views/EditGuestListView";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  useParams: () => ({ eventId: "123" }),
}));

// Mock the API service
jest.mock("../services/ApiService", () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock components used in EditGuestListView
jest.mock("../views/NavbarView", () => () => <div data-testid="navbar">Navbar</div>);
jest.mock("../views/FooterView", () => () => <div data-testid="footer">Footer</div>);

const mockGuestList = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890", status: "Invited" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "", status: "Pending" },
];

describe("EditGuestListView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    // Create a promise that we won't resolve, so the loading state remains
    const { apiService } = require("../services/ApiService");
    const apiPromise = new Promise((resolve) => {
      // This promise intentionally never resolves during the test
    });
    apiService.get.mockReturnValue(apiPromise);

    render(<EditGuestListView />);

    // Now we should be able to see the loading state
    expect(screen.getByText("Loading guests...")).toBeInTheDocument();
  });

  it("renders guest list details after loading", async () => {
    const { apiService } = require("../services/ApiService");
    apiService.get.mockResolvedValue({ data: mockGuestList });

    render(<EditGuestListView />);

    // Wait for the guest list to appear
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(screen.getByText("Guest List")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("displays error when guests cannot be loaded", async () => {
    // Mock console.error to prevent test output pollution
    const originalConsoleError = console.error;
    console.error = jest.fn();

    const { apiService } = require("../services/ApiService");
    apiService.get.mockRejectedValue(new Error("Guest list not found"));

    render(<EditGuestListView />);

    // Wait for loading to finish - in this case, we expect the error to be logged
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });

    // Restore console.error
    console.error = originalConsoleError;
  });

  it("calls API with correct event ID", async () => {
    const { apiService } = require("../services/ApiService");
    apiService.get.mockResolvedValue({ data: [] });

    render(<EditGuestListView />);

    await waitFor(() => {
      expect(apiService.get).toHaveBeenCalledWith("/event/123/guests");
    });
  });
});
