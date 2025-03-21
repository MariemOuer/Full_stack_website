import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
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
    await act(async () => {
      render(<ChatbotView />);
    });
    expect(await screen.findByText("Chat with Optimo")).toBeInTheDocument();
    expect(await screen.findByText(
      "Hello! My name is Optimo, your Occasio AI assistant to help you decide the details for your upcoming event! What type of event are you planning?"
    )).toBeInTheDocument();
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

    const idkButton = await screen.findByText("I don't know");

    await act(async () => {
      fireEvent.click(idkButton);
    });

    await waitFor(async () => {
      expect(await screen.findByText("Suggestion 1")).toBeInTheDocument();
      expect(await screen.findByText("Suggestion 2")).toBeInTheDocument();
    });
  });

  test("saves event when 'Save Event' button is clicked", async () => {
    chatbotController.saveEvent.mockResolvedValue("Event saved successfully!");

    await act(async () => {
      render(<ChatbotView />);
    });

    const saveEventButton = await screen.findByText("Save Event");

    await act(async () => {
      fireEvent.click(saveEventButton);
    });

    await waitFor(() => {
      expect(chatbotController.saveEvent).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Event saved successfully!");
    });
  });
});
