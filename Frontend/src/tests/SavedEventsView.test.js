import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SavedEventsView from "../views/SavedEventsView";
import { SavedEventsController } from "../controllers/SavedEventsController";
import "@testing-library/jest-dom";

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../controllers/SavedEventsController", () => ({
  SavedEventsController: {
    fetchEvents: jest.fn(),
  },
}));

describe("SavedEventsView", () => {
  beforeEach(() => {
    // Reset mocks before each test
    useAuth.mockReset();
    SavedEventsController.fetchEvents.mockReset();
  });

  it("renders loading state initially", () => {
    useAuth.mockReturnValue({ currentUser: { email: "test@example.com" } });
    SavedEventsController.fetchEvents.mockResolvedValue([]);

    render(
      <Router>
        <SavedEventsView />
      </Router>
    );

    expect(screen.getByText("Loading events...")).toBeInTheDocument();
  });

  it("fetches and displays saved events for a user", async () => {
    useAuth.mockReturnValue({ currentUser: { email: "test@example.com" } });
    const mockEvents = [
      {
        id: 1,
        user_email: "test@example.com",
        event_name: "Test Event 1",
        event_type: "Wedding",
      },
      {
        id: 2,
        user_email: "test@example.com",
        event_name: "Test Event 2",
        event_type: "Birthday",
      },
    ];
    SavedEventsController.fetchEvents.mockResolvedValue(mockEvents);

    render(
      <Router>
        <SavedEventsView />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Event 1")).toBeInTheDocument();
      expect(screen.getByText("Test Event 2")).toBeInTheDocument();
    });
  });

  it("displays 'No events found' message when no events are available", async () => {
    useAuth.mockReturnValue({ currentUser: { email: "test@example.com" } });
    SavedEventsController.fetchEvents.mockResolvedValue([]);

    render(
      <Router>
        <SavedEventsView />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("No events found.")).toBeInTheDocument();
    });
  });

  it("filters events based on the current user's email", async () => {
    useAuth.mockReturnValue({ currentUser: { email: "test@example.com" } });
    const mockEvents = [
      { id: 1, user_email: "test@example.com", event_name: "Test Event 1" },
      { id: 2, user_email: "other@example.com", event_name: "Test Event 2" },
    ];
    SavedEventsController.fetchEvents.mockResolvedValue(mockEvents);

    render(
      <Router>
        <SavedEventsView />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Event 1")).toBeInTheDocument();
      expect(screen.queryByText("Test Event 2")).not.toBeInTheDocument(); // Ensure the other user's event is not displayed
    });
  });

  it("displays 'Guest' as the current user when the email is guest@gmail.com", async () => {
    useAuth.mockReturnValue({ currentUser: { email: "guest@gmail.com" } });
    SavedEventsController.fetchEvents.mockResolvedValue([]);

    render(
      <Router>
        <SavedEventsView />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Guest")).toBeInTheDocument();
    });
  });

  it("displays welcome text as 'Welcome!' when the user is a guest", async () => {
    useAuth.mockReturnValue({ currentUser: { email: "guest@gmail.com" } });
    SavedEventsController.fetchEvents.mockResolvedValue([]);

    render(
      <Router>
        <SavedEventsView />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Welcome!")).toBeInTheDocument();
    });
  });

  it("displays welcome text as 'Welcome back!' when the user is not a guest", async () => {
    useAuth.mockReturnValue({ currentUser: { email: "test@example.com" } });
    SavedEventsController.fetchEvents.mockResolvedValue([]);

    render(
      <Router>
        <SavedEventsView />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Welcome back!")).toBeInTheDocument();
    });
  });

  it("selects the first event if events are available", async () => {
    useAuth.mockReturnValue({ currentUser: { email: "test@example.com" } });
    const mockEvents = [
      {
        id: 1,
        user_email: "test@example.com",
        event_name: "Test Event 1",
        event_type: "Wedding",
        event_date: "2025-05-05",
        event_length: "All day",
        guest_count: "100",
        location: "Ballroom",
        catering: "Buffet",
        theme: "Classic",
        entertainment: "DJ",
        accommodations: "Hotel rooms",
        special_requests: "None",
        event_timeline: "Ceremony, Reception, Dinner",
        budget: "10000",
      },
    ];
    SavedEventsController.fetchEvents.mockResolvedValue(mockEvents);

    render(
      <Router>
        <SavedEventsView />
      </Router>
    );

  });
});
