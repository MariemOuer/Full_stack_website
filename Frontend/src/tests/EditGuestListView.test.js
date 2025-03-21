import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { apiService } from "../services/ApiService";
import EditGuestListView from "../views/EditGuestListView";
import "@testing-library/jest-dom";

// Mock the modules
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("../services/ApiService", () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("EditGuestListView", () => {
  beforeEach(() => {
    // Clear mocks
    useParams.mockClear();
    apiService.get.mockClear();
    apiService.post.mockClear();
    apiService.delete.mockClear();
  });

  it("renders loading state initially", () => {
    useParams.mockReturnValue({ eventId: "123" });
    apiService.get.mockResolvedValue(new Promise(() => {})); // Never resolves

    render(
      <Router>
        <EditGuestListView />
      </Router>
    );
    expect(screen.getByText(/Loading guests.../i)).toBeInTheDocument();
  });

  it("fetches and displays guest list successfully", async () => {
    useParams.mockReturnValue({ eventId: "123" });
    const mockGuests = [
      { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "987-654-3210" },
    ];
    apiService.get.mockResolvedValue({ data: mockGuests });

    render(
      <Router>
        <EditGuestListView />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
      expect(screen.getByText(/123-456-7890/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
      expect(screen.getByText(/jane@example.com/i)).toBeInTheDocument();
      expect(screen.getByText(/987-654-3210/i)).toBeInTheDocument();
    });
  });

  it("adds a new guest to the list", async () => {
    useParams.mockReturnValue({ eventId: "123" });
    apiService.get.mockResolvedValue({ data: [] }); // Start with no guests
    apiService.post.mockResolvedValue({}); // Mock successful post

    render(
      <Router>
        <EditGuestListView />
      </Router>
    );

    const nameInput = screen.getByPlaceholderText(/Name/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const phoneInput = screen.getByPlaceholderText(/Phone/i);
    const addGuestButton = screen.getByText(/Add Guest/i);

    fireEvent.change(nameInput, { target: { value: "Test Guest" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(phoneInput, { target: { value: "111-222-3333" } });
    fireEvent.click(addGuestButton);

    await waitFor(() => {
      expect(apiService.post).toHaveBeenCalledWith(
        "/event/123/add-guest",
        expect.objectContaining({
          name: "Test Guest",
          email: "test@example.com",
          phone: "111-222-3333",
        })
      );
    });
  });

  it("removes a guest from the list", async () => {
    useParams.mockReturnValue({ eventId: "123" });
    const mockGuests = [{ id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890" }];
    apiService.get.mockResolvedValue({ data: mockGuests });
    apiService.delete.mockResolvedValue({}); // Mock successful delete

    render(
      <Router>
        <EditGuestListView />
      </Router>
    );

    await waitFor(() => {
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    const removeButton = screen.getByAltText("trashcan");
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(apiService.delete).toHaveBeenCalledWith("/guests/1");
    });
  });

  it("selects invitation style and sends invitations", async () => {
    useParams.mockReturnValue({ eventId: "123" });
    apiService.get.mockResolvedValue({ data: [] }); // Guests not relevant for this test
    apiService.post.mockResolvedValue({}); // Mock successful post

    render(
      <Router>
        <EditGuestListView />
      </Router>
    );

    const styleSelect = screen.getByLabelText(/Select Invitation Style:/i);
    const sendInvitesButton = screen.getByText(/Send Invitations/i);

    fireEvent.change(styleSelect, { target: { value: "classic" } });
    fireEvent.click(sendInvitesButton);

    await waitFor(() => {
      expect(apiService.post).toHaveBeenCalledWith("/event/123/send-invites", {
        style: "classic",
      });
    });
  });
});
