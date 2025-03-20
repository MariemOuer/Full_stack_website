import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatbotView from "../views/ChatbotView";
import { chatbotController } from "../controllers/ChatbotController";
import { useAuth } from "../context/AuthContext";

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
  });

  test("renders ChatbotView and displays initial bot message", () => {
    render(<ChatbotView />);
    
    expect(screen.getByText("Chat with Optimo")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Hello! My name is Optimo, your Occasio AI assistant to help you decide the details for your upcoming event! What type of event are you planning?"
      )
    ).toBeInTheDocument();
  });

  test("allows user to enter input and submit", async () => {
    render(<ChatbotView />);
    
    const inputField = screen.getByPlaceholderText("Type your answer...");
    const sendButton = screen.getByLabelText("Send");

    fireEvent.change(inputField, { target: { value: "Wedding" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText("Wedding")).toBeInTheDocument();
      expect(screen.getByText("When will the event take place?")).toBeInTheDocument();
    });
  });

  test("displays suggestions when user clicks 'I don't know'", async () => {
    chatbotController.getSuggestions.mockResolvedValue(["Suggestion 1", "Suggestion 2"]);
    
    render(<ChatbotView />);
    
    const idkButton = screen.getByText("I don't know");
    fireEvent.click(idkButton);

    await waitFor(() => {
      expect(screen.getByText("Suggestion 1")).toBeInTheDocument();
      expect(screen.getByText("Suggestion 2")).toBeInTheDocument();
    });
  });

  test("saves event when 'Save Event' button is clicked", async () => {
    chatbotController.saveEvent.mockResolvedValue("Event saved successfully!");
    
    render(<ChatbotView />);
    
    fireEvent.click(screen.getByText("Save Event"));

    await waitFor(() => {
      expect(chatbotController.saveEvent).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Event saved successfully!");
    });
  });
});
