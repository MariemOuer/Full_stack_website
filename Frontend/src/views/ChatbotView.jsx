import React, { useState, useEffect, useRef } from "react";
import { apiService } from "../services/ApiService";
import "../styles/chatbot.css";

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
  const chatBoxRef = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Check if we've already initialized to prevent double messages
    if (!isInitialized.current) {
      isInitialized.current = true;

      // Directly set the first message
      if (messages.length === 0) {
        setMessages([{ sender: "bot", text: questions[0] }]);
      }
    }
  }, []);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, suggestions]);

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
      setSuggestions([]); // Clear previous suggestions

      try {
        // Gather context from previous Q&A for more relevant suggestions
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

        if (response.data && response.data.length > 0) {
          setSuggestions(response.data);
        } else {
          addBotMessage("I don't have specific suggestions for this question. Please provide your best estimate.");
        }
      } catch (err) {
        console.error("Error retrieving suggestions from backend", err);
        addBotMessage("Sorry, I couldn't generate suggestions at this time. Please try again or provide your answer.");
      } finally {
        setLoading(false);
      }
      return; // Don't proceed to next question yet
    }

    // Normal answer flow
    addUserMessage(answer);
    setInput("");
    await delay(500);
    nextQuestion();
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      addBotMessage(questions[currentQuestion + 1]);
    } else {
      setShowPopup(true);
    }
    setSuggestions([]); // Clear suggestions when moving to next question
  };

  const handleSuggestionClick = (suggestion) => {
    addUserMessage(suggestion);
    setSuggestions([]);
    nextQuestion();
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSaveEvent = async () => {
    setLoading(true);
    const userAnswers = messages.filter((m) => m.sender === "user").map((m) => m.text);

    const payload = {
      user_email: "user@example.com", // This would typically come from auth context
      event_name: userAnswers[0] || "", // Using event type as the name
      event_type: userAnswers[0] || "",
      event_date: userAnswers[1] || "",
      event_time: userAnswers[2] || "",
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
      alert("Event saved successfully!");
      setShowPopup(false);
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format chat message with Markdown-like syntax
  const formatMessage = (text) => {
    // Bold text
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Italics
    formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>");

    return formattedText;
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-avatar">
          <span className="avatar-text">O</span>
        </div>
        <h1>Chat with Optimo</h1>
      </div>

      <div className="chatbot-main">
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}>
              <div className={`message-bubble ${msg.sender === "user" ? "user-bubble" : "bot-bubble"}`}>
                <p dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}></p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message bot-message">
              <div className="message-bubble bot-bubble typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="suggestion-container">
            <div className="suggestion-header">
              <p>Here are some suggestions:</p>
            </div>
            <div className="suggestion-buttons">
              {suggestions.map((sugg, i) => (
                <button key={i} className="suggestion-button" onClick={() => handleSuggestionClick(sugg)}>
                  {sugg}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="input-container">
          <input
            type="text"
            placeholder="Type your answer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field"
            disabled={loading || suggestions.length > 0}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleUserInput();
            }}
          />
          <button onClick={() => handleUserInput()} className="send-button" disabled={loading || !input.trim() || suggestions.length > 0} aria-label="Send">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>

          {currentQuestion > 0 && suggestions.length === 0 && (
            <button onClick={() => handleUserInput("I don't know")} className="idk-button" disabled={loading}>
              I don't know
            </button>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-header">
              <h2>Event Summary</h2>
              <button className="popup-close" onClick={() => setShowPopup(false)}>
                ×
              </button>
            </div>

            <div className="popup-content">
              {questions.map((q, idx) => {
                const userAnswer = messages.filter((m) => m.sender === "user")[idx]?.text || "No answer provided";

                return (
                  <div key={idx} className="summary-item">
                    <h3 dangerouslySetInnerHTML={{ __html: formatMessage(q) }}></h3>
                    <p>{userAnswer}</p>
                  </div>
                );
              })}
            </div>

            <div className="popup-actions">
              <button className="save-button" onClick={handleSaveEvent} disabled={loading}>
                {loading ? "Saving..." : "Save Event"}
              </button>
              <button className="close-button" onClick={() => setShowPopup(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotView;
