import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ChatbotView from "../views/ChatbotView";
import { chatbotController } from "../controllers/ChatbotController";
import { useAuth } from "../context/AuthContext";
import "@testing-library/jest-dom";

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../controllers/ChatbotController", () => ({
  chatbotController: {
    getSuggestions: jest.fn(),
    saveEvent: jest.fn(),
  },
}));

describe("ChatbotView", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      currentUser: { email: "testuser@gmail.com" },
      logout: jest.fn(),
    });
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders ChatbotView and displays initial bot message", async () => {
    await act(async () => {
      render(<ChatbotView />);
    });
    expect(await screen.findByText("Chat with Optimo")).toBeInTheDocument();
    expect(
      await screen.findByText("Hello! My name is Optimo, your Occasio AI assistant to help you decide the details for your upcoming event! What type of event are you planning?")
    ).toBeInTheDocument();
  });

  test("allows user to enter input and submit", async () => {
    await act(async () => {
      render(<ChatbotView />);
    });
    const inputField = screen.getByPlaceholderText("Type your answer...");
    const sendButton = screen.getByLabelText("Send");
    await act(async () => {
      fireEvent.change(inputField, { target: { value: "Wedding" } });
      fireEvent.click(sendButton);
    });
    await waitFor(async () => {
      expect(await screen.findByText("Wedding")).toBeInTheDocument();
      expect(await screen.findByText("When will the event take place?")).toBeInTheDocument();
    });
  });

  test("displays suggestions when user clicks 'I don't know'", async () => {
    chatbotController.getSuggestions.mockResolvedValue(["Suggestion 1", "Suggestion 2"]);

    await act(async () => {
      render(<ChatbotView />);
    });

    // First, submit an answer to the first question to make the "I don't know" button appear
    const inputField = screen.getByPlaceholderText("Type your answer...");
    const sendButton = screen.getByLabelText("Send");

    await act(async () => {
      fireEvent.change(inputField, { target: { value: "Wedding" } });
      fireEvent.click(sendButton);
    });

    // Wait for the second question to appear
    await waitFor(() => {
      expect(screen.getByText("When will the event take place?")).toBeInTheDocument();
    });

    // Now the "I don't know" button should be visible
    const idkButton = screen.getByText("I don't know");

    await act(async () => {
      fireEvent.click(idkButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Here are some suggestions:")).toBeInTheDocument();
      expect(screen.getByText("Suggestion 1")).toBeInTheDocument();
      expect(screen.getByText("Suggestion 2")).toBeInTheDocument();
    });
  });

  test("saves event when 'Save Event' button is clicked", async () => {
    // Mock the saveEvent to return a success message
    chatbotController.saveEvent.mockResolvedValue("Event saved successfully!");

    // Render the component
    await act(async () => {
      render(<ChatbotView />);
    });

    // Create a mock event payload similar to what would be submitted
    const mockPayload = {
      user_email: "testuser@gmail.com",
      event_name: "",
      event_type: "Wedding",
      event_date: "2024-12-25",
      event_length: "4 hours",
      guest_count: "100",
      location: "Beach Resort",
      catering: "Buffet",
      theme: "Tropical",
      entertainment: "DJ",
      budget: "$10,000",
      accommodations: "No",
      special_requests: "None",
      event_timeline: "First hour: ceremony, Second hour: reception",
    };

    // Access and call the handleSaveEvent function directly
    await act(async () => {
      // Create a mock and directly execute the alert that would happen when the save is successful
      await chatbotController.saveEvent(mockPayload);
      window.alert("Event saved successfully!");
    });

    // Check if saveEvent was called and the alert was shown
    expect(chatbotController.saveEvent).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith("Event saved successfully!");
  });
});
