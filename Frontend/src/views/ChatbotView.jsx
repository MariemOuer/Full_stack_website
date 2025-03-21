import React, { useState, useEffect, useRef } from "react";
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
  const [isCompleted, setIsCompleted] = useState(false);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const isInitialized = useRef(false);

  const resetChatbot = () => {
    setMessages([{ sender: "bot", text: questions[0] }]);
    setCurrentQuestion(0);
    setInput("");
    setLoading(false);
    setSuggestions([]);
    setShowPopup(false);
    setIsCompleted(false);
    isInitialized.current = true;
  };

  useEffect(() => {
    // Check if we've already initialized to prevent double messages
    if (!isInitialized.current) {
      resetChatbot();
    }
  }, []);

  // Auto-focus input when loading is complete, suggestions change, or question changes
  useEffect(() => {
    if (!loading && !suggestions.length && !showPopup && !isCompleted) {
      inputRef.current?.focus();
    }
  }, [loading, suggestions, currentQuestion, showPopup, isCompleted]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, suggestions]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
  };

  const handleUserInput = async (userAnswer) => {
    // Prevent input when popup is shown or event is completed
    if (showPopup || isCompleted) return;

    let answer = userAnswer || input.trim();
    if (!answer) return;

    // Clear suggestions immediately when an answer is submitted
    setSuggestions([]);

    const isIdkClicked = answer.toLowerCase() === "i don't know";

    // Disable input during processing
    setLoading(true);

    if (isIdkClicked) {
      // Build context from previous answers
      let contextText = "";
      if (currentQuestion > 0) {
        const previousUserAnswers = messages.filter((m) => m.sender === "user");
        contextText = questions
          .slice(0, currentQuestion)
          .map((q, index) => `${q}: ${previousUserAnswers[index]?.text || "No answer provided"}`)
          .join("\n");
      }

      const extractedSuggestions = await chatbotController.getSuggestions(contextText, questions[currentQuestion]);
      setSuggestions(extractedSuggestions);

      // Key change: Set loading to false immediately when suggestions arrive
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
      setLoading(false);
    } else {
      setShowPopup(true);
      setIsCompleted(true);
      setLoading(false);
    }
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    addUserMessage(suggestion);
    setSuggestions([]);
    nextQuestion();
  };

  // Rest of the code remains the same as in the original implementation
  const handleSaveEvent = async () => {
    const userAnswers = messages.filter((m) => m.sender === "user").map((m) => m.text);
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

  const closePopup = () => {
    resetChatbot();
  };

  const formatMessage = (text) => {
    // Bold text
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Italics
    formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>");

    return formattedText;
  };

  return (
    <>
      <Navbar />
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
              ref={inputRef}
              type="text"
              placeholder="Type your answer..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-field"
              disabled={loading || showPopup || isCompleted}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleUserInput();
              }}
            />
            <button onClick={() => handleUserInput()} className="send-button" disabled={loading || !input.trim() || showPopup || isCompleted} aria-label="Send">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>

            {currentQuestion > 0 && suggestions.length === 0 && !showPopup && !isCompleted && (
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
                <button className="popup-close" onClick={closePopup}>
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
                <button className="close-button" onClick={closePopup}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <FooterView />
    </>
  );
};

export default ChatbotView;
