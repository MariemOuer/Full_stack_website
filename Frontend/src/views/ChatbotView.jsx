import React, { useState, useEffect, useRef } from "react";
import { chatbotController } from "../controllers/ChatbotController";
import { useAuth } from "../context/AuthContext";
import "../styles/chatbotStyle.css";
import Navbar from "./NavbarView";
import FooterView from "./FooterView";
import { checkIfCurrentUserIsGuest } from "../utils/GuestHelpers";

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

const initialQuestionIndex = 0;
const minNumberOfSuggestions = 3;

const ChatbotView = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isPopupShown, setIsPopupShown] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const isInitialized = useRef(false);

  const resetChatbot = () => {
    setMessages([{ sender: "bot", text: questions[initialQuestionIndex] }]);
    setCurrentQuestion(0);
    setInput("");
    setIsLoading(false);
    setSuggestions([]);
    setIsPopupShown(false);
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
    if (!isLoading && !suggestions.length && !isPopupShown && !isCompleted) {
      inputRef.current?.focus();
    }
  }, [isLoading, suggestions, currentQuestion, isPopupShown, isCompleted]);

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
    if (isPopupShown || isCompleted) return;

    let answer = userAnswer || input.trim();
    if (!answer) return;

    // Clear suggestions immediately when an answer is submitted
    setSuggestions([]);

    const isIdkClicked = answer.toLowerCase() === "i don't know";

    // Disable input during processing
    setIsLoading(true);

    if (isIdkClicked) {
      // Build context from previous answers
      let contextText = "";
      if (currentQuestion > initialQuestionIndex) {
        const previousUserAnswers = messages.filter((message) => message.sender === "user");
        contextText = questions
          .slice(initialQuestionIndex, currentQuestion)
          .map((q, index) => `${q}: ${previousUserAnswers[index]?.text || "No answer provided"}`)
          .join("\n");
      }

      var extractedSuggestions = [];
      // Key change: Loop until suggestions are extracted
      while (extractedSuggestions.length < minNumberOfSuggestions) {
        extractedSuggestions = await chatbotController.getSuggestions(contextText, questions[currentQuestion]);
      }

      setSuggestions(extractedSuggestions);

      // Key change: Set loading to false immediately when suggestions arrive
      setIsLoading(false);
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
      const nextQuestionIndex = currentQuestion + 1;
      setCurrentQuestion(nextQuestionIndex);
      addBotMessage(questions[nextQuestionIndex]);
    } else {
      setIsPopupShown(true);
      setIsCompleted(true);
    }
    setIsLoading(false);
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    addUserMessage(suggestion);
    setSuggestions([]);
    nextQuestion();
  };

  // Rest of the code remains the same as in the original implementation
  const handleSaveEvent = async () => {
    const userAnswers = messages.filter((message) => message.sender === "user").map((message) => message.text);
    const payload = {
      user_email: checkIfCurrentUserIsGuest(currentUser) ? "Guest" : currentUser?.email,
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
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender === "user" ? "user-message" : "bot-message"}`}>
                <div className={`message-bubble ${message.sender === "user" ? "user-bubble" : "bot-bubble"}`}>
                  <p dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}></p>
                </div>
              </div>
            ))}

            {isLoading && (
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
                {suggestions.map((suggestion, index) => (
                  <button key={index} className="suggestion-button" onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion}
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
              onChange={(event) => setInput(event.target.value)}
              className="input-field"
              disabled={isLoading || isPopupShown || isCompleted}
              onKeyUp={(event) => {
                if (event.key === "Enter") handleUserInput();
              }}
            />
            <button onClick={() => handleUserInput()} className="send-button" disabled={isLoading || !input.trim() || isPopupShown || isCompleted} aria-label="Send">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>

            {currentQuestion > initialQuestionIndex && suggestions.length === 0 && !isPopupShown && !isCompleted && (
              <button onClick={() => handleUserInput("I don't know")} className="idk-button" disabled={isLoading}>
                I don't know
              </button>
            )}
          </div>
        </div>

        {isPopupShown && (
          <div className="popup-overlay">
            <div className="popup">
              <div className="popup-header">
                <h2>Event Summary</h2>
                <button className="popup-close" onClick={closePopup}>
                  ×
                </button>
              </div>

              <div className="popup-content">
                {questions.map((question, index) => {
                  const userAnswer = messages.filter((message) => message.sender === "user")[index]?.text || "No answer provided";

                  return (
                    <div key={index} className="summary-item">
                      <h3 dangerouslySetInnerHTML={{ __html: formatMessage(question) }}></h3>
                      <p>{userAnswer}</p>
                    </div>
                  );
                })}
              </div>

              <div className="popup-actions">
                <button className="save-button" onClick={handleSaveEvent} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Event"}
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
