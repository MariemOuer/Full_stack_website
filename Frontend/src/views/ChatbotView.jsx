import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/chatbot.css";
import { apiService } from "../services/ApiService";

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
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (messages.length === 0 && currentQuestion < questions.length) {
      addBotMessage(questions[currentQuestion]);
    }
  }, []);

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

      try {
        let contextText = "";
        if (currentQuestion > 0) {
          const previousUserAnswers = messages.filter((m) => m.sender === "user");
          contextText = questions
            .slice(0, currentQuestion)
            .map((q, index) => `${q}: ${previousUserAnswers[index]?.text || "No answer provided"}`)
            .join("\n");
        }

        const response = await apiService.post("/api/chat-bot/suggestions", {
          context: contextText,
          question: questions[currentQuestion],
        });

        if (response.data) {
          setSuggestions(response.data);
          setLoading(false);
          return;
        } else {
          answer = "No suggestions available at this time.";
        }
      } catch (err) {
        console.error("Error retrieving suggestions from backend", err);
        answer = "Error retrieving suggestions. Please try again.";
      }
      setLoading(false);
    }

    if (!isIdkClicked) {
      addUserMessage(answer);
      setInput("");
      await delay(500);
      nextQuestion();
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      addBotMessage(questions[currentQuestion + 1]);
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

  const aiSuggestionsToArray = (text) =>
    text
      .split("\n")
      .filter((line) => line.trim().startsWith("- Option"))
      .map((line) => line.replace(/^- Option\s*\d+:\s*/, "").trim())
      .filter(Boolean);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSaveEvent = async () => {
    const userAnswers = messages.filter((m) => m.sender === "user").map((m) => m.text);
    const payload = {
      user_email: "user@example.com",
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

    try {
      const response = await apiService.post("/api/chat-bot/save-event", payload);
      alert(response.data);
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="chat-container">
        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.sender === "user" ? "user-bubble" : "bot-bubble"}>
              <p>{msg.text}</p>
            </div>
          ))}
          {loading && (
            <div className="bot-bubble">
              <p>Bot is typing...</p>
            </div>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="suggestion-container">
            {suggestions.map((sugg, i) => (
              <button key={i} className="suggestion-button" onClick={() => handleSuggestionClick(sugg)}>
                {sugg}
              </button>
            ))}
          </div>
        )}

        <div className="input-container">
          <input
            type="text"
            placeholder="Talk to Optimo..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field"
            disabled={loading}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleUserInput();
            }}
          />
          <button onClick={() => handleUserInput()} className="send-button" disabled={loading || !input.trim()}>
            Send
          </button>
          {currentQuestion > 0 && (
            <button onClick={() => handleUserInput("I don't know")} className="idk-button" disabled={loading}>
              I don't know
            </button>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Event Summary</h3>
            {questions.map((q, idx) => (
              <div key={idx} style={{ marginBottom: "10px" }}>
                <strong>{q}</strong>
                <p>{messages.filter((m) => m.sender === "user")[idx]?.text || "No answer provided"}</p>
              </div>
            ))}
            <button className="save-button" onClick={handleSaveEvent}>
              Save Event
            </button>
            <button className="close-button" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Set background color for full page
document.body.classList.add("chatbot-body");

export default ChatbotView;
