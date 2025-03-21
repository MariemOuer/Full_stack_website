import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import InvitationView from "../views/InvitationView";
import { apiService } from "../services/ApiService";

// Mock dependencies without using react-router-dom
jest.mock("../services/ApiService", () => ({
  apiService: {
    get: jest.fn(),
  },
}));

// Mock the components used within InvitationView
jest.mock("../views/NavbarView", () => () => <div data-testid="navbar">Mock Navbar</div>);
jest.mock("../views/FooterView", () => () => <div data-testid="footer">Mock Footer</div>);

// Mock the react-router-dom's useParams hook directly
jest.mock("react-router-dom", () => ({
  useParams: () => ({ eventId: "123" }),
}));

const mockEvent = {
  event_name: "Test Event",
  event_date: "2023-12-31",
  location: "Test Location",
  theme: "Test Theme",
};

describe("InvitationView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    // Mock the API call to delay resolution so we can see the loading state
    apiService.get.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ data: mockEvent }), 100)));

    render(<InvitationView />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders event details after loading", async () => {
    // Setup API mock
    apiService.get.mockResolvedValue({ data: mockEvent });

    // Render with act to handle async state updates
    await act(async () => {
      render(<InvitationView />);
    });

    // Wait for loading to finish and verify content
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // Check for event details
    expect(screen.getByText(/Date:/)).toBeInTheDocument();
    expect(screen.getByText(/Location:/)).toBeInTheDocument();
    expect(screen.getByText(/Theme:/)).toBeInTheDocument();
    expect(screen.getByText(/2023-12-31/)).toBeInTheDocument();
    expect(screen.getByText(/Test Location/)).toBeInTheDocument();
    expect(screen.getByText(/Test Theme/)).toBeInTheDocument();
  });

  it("displays error message when event is not found", async () => {
    // Mock the API to reject with an error
    apiService.get.mockRejectedValue(new Error("Event not found"));

    // Render with act to handle async state updates
    await act(async () => {
      render(<InvitationView />);
    });

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // Check for error message
    expect(screen.getByText("Event not found.")).toBeInTheDocument();
  });

  it("renders Navbar and Footer", async () => {
    apiService.get.mockResolvedValue({ data: mockEvent });

    await act(async () => {
      render(<InvitationView />);
    });

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("changes invitation style when dropdown is changed", async () => {
    apiService.get.mockResolvedValue({ data: mockEvent });

    await act(async () => {
      render(<InvitationView />);
    });

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // Find the select element
    const styleSelect = screen.getByLabelText("Choose an invitation style:");

    // Change the selection to 'classic'
    await act(async () => {
      fireEvent.change(styleSelect, { target: { value: "classic" } });
    });

    // Verify the style changed by checking for classic style title
    expect(screen.getByText("You're Invited!")).toBeInTheDocument();
  });

  it("renders all style options in the dropdown", async () => {
    apiService.get.mockResolvedValue({ data: mockEvent });

    await act(async () => {
      render(<InvitationView />);
    });

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // Find the select element
    const styleSelect = screen.getByLabelText("Choose an invitation style:");

    // Check if all style options are present
    const options = Array.from(styleSelect.options).map((option) => option.value);
    expect(options).toEqual(["whimsical", "classic", "professional", "fun"]);
  });
});
