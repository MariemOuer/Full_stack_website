import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import EditGuestListView from "../views/EditGuestListView";
import { apiService } from "../services/ApiService"; 

jest.mock("../services/ApiService"); 

describe("EditGuestListView", () => {
  const eventId = "123"; 

  beforeEach(() => {
    apiService.get.mockResolvedValue({ data: [] }); 
    apiService.post.mockResolvedValue({}); 
    apiService.delete.mockResolvedValue({});
  });

  it("should render the guest list page correctly", async () => {
    render(
      <Router>
        <EditGuestListView />
      </Router>
    );

    expect(screen.getByText("Guest List")).toBeInTheDocument();
    expect(screen.getByText("Select Invitation Style:")).toBeInTheDocument();
    expect(screen.getByText("Send Invitations")).toBeInTheDocument();
    expect(screen.getByText("Add New Guest:")).toBeInTheDocument();
  });

  it("should load guests and display them", async () => {
    const mockGuests = [
      { id: "1", name: "John Doe", email: "john@example.com", phone: "1234567890", status: "Pending" },
      { id: "2", name: "Jane Doe", email: "jane@example.com", phone: "0987654321", status: "Confirmed" },
    ];

    apiService.get.mockResolvedValue({ data: mockGuests });

    render(
      <Router>
        <EditGuestListView />
      </Router>
    );

    await waitFor(() => screen.getByText("John Doe"));
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
  });

  it("should allow adding a new guest", async () => {
    render(
      <Router>
        <EditGuestListView />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "New Guest" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "new@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Phone"), { target: { value: "5555555555" } });

    apiService.post.mockResolvedValueOnce({});

    fireEvent.click(screen.getByText("Add Guest"));

    await waitFor(() => expect(apiService.post).toHaveBeenCalledWith(
      `/event/123/add-guest`, { name: "New Guest", email: "new@example.com", phone: "5555555555" }
    ));
  });

  it("should allow removing a guest", async () => {
    const mockGuests = [
      { id: "1", name: "John Doe", email: "john@example.com", phone: "1234567890", status: "Pending" },
    ];

    apiService.get.mockResolvedValueOnce({ data: mockGuests });

    render(
      <Router>
        <EditGuestListView />
      </Router>
    );

    await waitFor(() => screen.getByText("John Doe"));

    apiService.delete.mockResolvedValueOnce({});

    fireEvent.click(screen.getByAltText("trashcan"));

    await waitFor(() => expect(apiService.delete).toHaveBeenCalledWith(`/guests/1`));
  });

  it("should allow selecting an invitation style", async () => {
    render(
      <Router>
        <EditGuestListView />
      </Router>
    );

    fireEvent.change(screen.getByLabelText("Select Invitation Style:"), { target: { value: "classic" } });

    expect(screen.getByLabelText("Select Invitation Style:")).toHaveValue("classic");
  });

  it("should handle sending invitations", async () => {
    render(
      <Router>
        <EditGuestListView />
      </Router>
    );

    apiService.post.mockResolvedValueOnce({});

    fireEvent.click(screen.getByText("Send Invitations"));

    await waitFor(() => expect(apiService.post).toHaveBeenCalledWith(
      `/event/123/send-invites`, { style: "whimsical" }
    ));
  });
});
