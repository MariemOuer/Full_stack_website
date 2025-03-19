// components/ChatbotView.js

import React, { useState, useEffect } from "react";
import { chatbotController } from "../controllers/ChatbotController";
import { useAuth } from "../context/AuthContext";
import "../styles/chatbotStyle.css";
import Navbar from "./NavbarView";
import FooterView from "./FooterView";

const questions = [
  "Hello! My name is Optimo, your Occasio AI assistant to help you decide the details for your upcoming event! What type of event are you planning?",
  "When will the event take place?",
  "What time is the event?",
  "How long is the event?",
  "How many guests are expected?",
  "What is the event location?",
  "What kind of catering would you prefer?",
  "What's your preferred theme?",
  "Will you require entertainment?",
  "What is your overall budget?",
  "Do you need accommodations for guests?",
  "Any special requirements or requests?",
  "Please provide a **timeline** of your event (e.g., First Hour: Drinks & Appetizers, Second Hour: Cake Cutting, etc.).",
];

const ChatbotView = () => {
  const { currentUser, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // On mount, display the first question as a bot message.
  useEffect(() => {
    if (messages.length === 0 && currentQuestion < questions.length) {
      addBotMessage(questions[currentQuestion]);
    }
  }, [currentQuestion, messages.length]);

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
  };

  const handleUserInput = async (userAnswer) => {
    let answer = userAnswer || input.trim();
    if (!answer) return;

    const isIdkClicked = answer.toLowerCase() === "i don't know";

    if (isIdkClicked) {
      setLoading(true);

      // Build context from previous answers
      let contextText = "";
      if (currentQuestion > 0) {
        const previousUserAnswers = messages.filter((m) => m.sender === "user");
        contextText = questions
          .slice(0, currentQuestion)
          .map(
            (q, index) =>
              `${q}: ${
                previousUserAnswers[index]?.text || "No answer provided"
              }`
          )

          .join("\n");
      }

      const extractedSuggestions = await chatbotController.getSuggestions(
        contextText,
        questions[currentQuestion]
      );
      setSuggestions(extractedSuggestions);
      setLoading(false);
      return;
    }

    // Proceed to the next question if not "I don't know"
    addUserMessage(answer);
    setInput("");
    await delay(500);
    nextQuestion();
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      const nextQ = currentQuestion + 1;
      setCurrentQuestion(nextQ);
      addBotMessage(questions[nextQ]);
    } else {
      setShowPopup(true);
    }
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    addUserMessage(suggestion);
    setSuggestions([]);
    nextQuestion();
  };

  const handleSaveEvent = async () => {
    const userAnswers = messages
      .filter((m) => m.sender === "user")
      .map((m) => m.text);
    const payload = {
      user_email: currentUser?.email?.toLowerCase() === "guest@gmail.com" ? "Guest" : currentUser?.email,
      event_name: "",
      event_type: userAnswers[0] || "",
      event_date: userAnswers[1] || "",
      event_length: userAnswers[3] || "",
      guest_count: userAnswers[4] || "",
      location: userAnswers[5] || "",
      catering: userAnswers[6] || "",
      theme: userAnswers[7] || "",
      entertainment: userAnswers[8] || "",
      budget: userAnswers[9] || "",
      accommodations: userAnswers[10] || "",
      special_requests: userAnswers[11] || "",
      event_timeline: userAnswers[12] || "",
    };

    const message = await chatbotController.saveEvent(payload);
    alert(message);
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="container">
        <div className="chatContainer">
          <div className="chatBox">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={msg.sender === "user" ? "userBubble" : "botBubble"}
              >
                <p className="messageText">{msg.text}</p>
              </div>
            ))}
            {loading && (
              <div className="botBubble">
                <p className="messageText">Bot is typing...</p>
              </div>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="suggestionContainer">
              {suggestions.map((sugg, i) => (
                <button
                  key={i}
                  className="suggestionButton"
                  onClick={() => handleSuggestionClick(sugg)}
                >
                  {sugg}
                </button>
              ))}
            </div>
          )}

          <div
            className={`inputContainer ${
              currentQuestion === 0 ? "no-idk" : ""
            }`}
          >
            <input
              type="text"
              placeholder="Talk to Optimo..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="inputField"
              disabled={loading}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleUserInput();
              }}
            />
            <button
              onClick={() => handleUserInput()}
              className="sendButton"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
            {currentQuestion > 0 && (
              <button
                onClick={() => handleUserInput("I don't know")}
                className="idkButton"
                disabled={loading}
              >
                I don't know
              </button>
            )}
          </div>
        </div>

        {showPopup && (
          <div className="popup">
            <div className="popupContent">
              <h3>Event Summary</h3>
              {questions.map((q, idx) => (
                <div key={idx} style={{ marginBottom: "10px" }}>
                  <strong>{q}</strong>
                  <p>
                    {messages.filter((m) => m.sender === "user")[idx]?.text ||
                      "No answer provided"}
                  </p>
                </div>
              ))}
              <button className="saveButton" onClick={handleSaveEvent}>
                Save Event
              </button>
              <button
                className="closeButton"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <FooterView></FooterView>
    </div>
  );
};

export default ChatbotView;
