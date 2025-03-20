import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import EditEventDetailsView from "../views/EditEventDetailsView";
import { apiService } from "../services/ApiService"; 

jest.mock("../services/ApiService");

describe("EditEventDetailsView", () => {
  const eventId = "123"; 

  beforeEach(() => {
    apiService.get.mockResolvedValue({ data: {} }); 
  });

  it("should render the loading state initially", () => {
    render(
      <Router>
        <EditEventDetailsView />
      </Router>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render event details after fetching data", async () => {
    const mockEvent = {
      event_name: "Birthday Party",
      event_type: "Private",
      event_date: "2025-06-15",
      location: "Central Park",
      theme: "Whimsical",
      budget: "$5000",
    };

    apiService.get.mockResolvedValueOnce({ data: mockEvent });

    render(
      <Router>
        <EditEventDetailsView />
      </Router>
    );

    await waitFor(() => screen.getByText("Birthday Party"));

    expect(screen.getByText("Birthday Party")).toBeInTheDocument();
    expect(screen.getByText("Event Type: Private")).toBeInTheDocument();
    expect(screen.getByText("Date: 2025-06-15")).toBeInTheDocument();
    expect(screen.getByText("Location: Central Park")).toBeInTheDocument();
    expect(screen.getByText("Theme: Whimsical")).toBeInTheDocument();
    expect(screen.getByText("Budget: $5000")).toBeInTheDocument();
  });

  it("should handle the case when the event is not found", async () => {
    apiService.get.mockResolvedValueOnce({ data: null });

    render(
      <Router>
        <EditEventDetailsView />
      </Router>
    );

    await waitFor(() => screen.getByText("Event not found."));

    expect(screen.getByText("Event not found.")).toBeInTheDocument();
  });

  it("should handle errors during the fetching process", async () => {
    apiService.get.mockRejectedValueOnce(new Error("Error fetching event"));

    render(
      <Router>
        <EditEventDetailsView />
      </Router>
    );

    await waitFor(() => screen.getByText("Loading..."));
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => screen.getByText("Event not found."));
    expect(screen.getByText("Event not found.")).toBeInTheDocument();
  });
});
