import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatbotView from "../views/ChatbotView";
import { chatbotController } from "../controllers/ChatbotController";
import { useAuth } from "../context/AuthContext";
import '@testing-library/jest-dom';

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
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders ChatbotView and displays initial bot message", async () => {
    render(<ChatbotView />);

    expect(await screen.findByText("Chat with Optimo")).toBeInTheDocument();
    expect(await screen.findByText(
      "Hello! My name is Optimo, your Occasio AI assistant to help you decide the details for your upcoming event! What type of event are you planning?"
    )).toBeInTheDocument();
  });

  test("allows user to enter input and submit", async () => {
    render(<ChatbotView />);

    const inputField = screen.getByPlaceholderText("Type your answer...");
    const sendButton = screen.getByLabelText("Send");

    fireEvent.change(inputField, { target: { value: "Wedding" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText("Wedding")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("When will the event take place?")).toBeInTheDocument();
    });
  });

  test("displays suggestions when user clicks 'I don't know'", async () => {
    chatbotController.getSuggestions.mockResolvedValue(["Suggestion 1", "Suggestion 2"]);

    render(<ChatbotView />);

    const inputField = screen.getByPlaceholderText("Type your answer...");
    const sendButton = screen.getByLabelText("Send");

    fireEvent.change(inputField, { target: { value: "Wedding" } });
    fireEvent.click(sendButton);

    const idkButton = await screen.findByText(/i don't know/i);
    fireEvent.click(idkButton);

    await waitFor(() => {
      expect(screen.getByText("Suggestion 1")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Suggestion 2")).toBeInTheDocument();
    });
  });

  test("saves event when 'Save Event' button is clicked", async () => {
    chatbotController.saveEvent.mockResolvedValue("✅ Event and guests created successfully!");

    render(<ChatbotView />);

    const inputField = screen.getByPlaceholderText("Type your answer...");
    const sendButton = screen.getByLabelText("Send");

    // Simulate answering all questions
    const questions = [
      "Wedding",
      "2023-12-25",
      "18:00",
      "4 hours",
      "100",
      "New York",
      "Buffet",
      "Classic",
      "Yes",
      "$10,000",
      "No",
      "None",
      "First Hour: Drinks & Appetizers, Second Hour: Cake Cutting",
    ];

    for (const answer of questions) {
      fireEvent.change(inputField, { target: { value: answer } });
      fireEvent.click(sendButton);
    }

    // Wait for the popup to appear
    await waitFor(() => {
      expect(screen.getByText("Event Summary")).toBeInTheDocument();
    });

    // Now find the "Save Event" button within the popup
    const saveEventButton = screen.getByText(/save event/i);
    fireEvent.click(saveEventButton);

    // Verify that the alert was called with the correct message
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("✅ Event and guests created successfully!");
    });
  });
});