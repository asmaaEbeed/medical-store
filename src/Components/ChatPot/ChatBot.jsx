import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatBot.css";
import ChatHistory from "./ChatHistory";
import { Button, Card, Form, Spinner, Image } from "react-bootstrap";
// Import React Icons
import { FiSend, FiX, FiTrash2 } from "react-icons/fi";
import { BsSun, BsMoon } from "react-icons/bs";
import { FaRobot, FaLeaf } from "react-icons/fa";

const ChatBot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);

  // Get API key from environment variables or use hardcoded for development
  const API_KEY = "AIzaSyA8RS1SdbW0at3vWMkAAqAi4_xxumCLsAc";

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [isOpen]);

  // Function to handle user input
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  // Function to toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    console.log("Dark mode toggled, current state:", darkMode);
    setDarkMode(!darkMode);
  };

  // Function to send user message
  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    // Add user message to chat history immediately
    setChatHistory([
      ...chatHistory,
      { type: "user", message: userInput }
    ]);
    
    const currentInput = userInput;
    setUserInput("");
    setIsLoading(true);
    
    try {
      // Make a direct API call to Google's API with the correct model name
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', 
        {
          contents: [{ 
            role: "user",
            parts: [{ text: currentInput }] 
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': API_KEY
          }
        }
      );
      
      // Extract the response text
      const responseText = response.data.candidates[0].content.parts[0].text;
      
      // Add AI response to the chat history
      setChatHistory(prevHistory => [
        ...prevHistory,
        { type: "bot", message: responseText }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      console.log("Error details:", error.response?.data || error.message);
      
      // Add error message to chat
      setChatHistory(prevHistory => [
        ...prevHistory,
        { type: "bot", message: "Sorry, I encountered an error processing your request. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading && userInput.trim() !== "") {
      e.preventDefault();
      sendMessage();
    }
  };

  // Function to clear the chat history
  const clearChat = () => {
    setChatHistory([]);
  };

  // Theme-based styles - Using specified colors
  const themeStyles = {
    chatButton: {
      backgroundColor: '#102F51', // Dark blue for dark mode, green for light
      boxShadow: darkMode ? '0 4px 12px rgba(16, 47, 81, 0.3)' : '0 4px 12px rgba(124, 170, 95, 0.3)',
    },
    cardHeader: {
      backgroundColor: darkMode ? '#102F51' : '#102F51', // Dark blue for dark mode, green for light
      color: darkMode ? '#FCB77C' : '#ffffff'
    },
    cardBody: {
      backgroundColor: darkMode ? '#1a3a5f' : '#f8f9fa',
      color: darkMode ? '#e9ecef' : '#212529',
    },
    cardFooter: {
      backgroundColor: darkMode ? '#102F51' : '#ffffff',
      borderTop: darkMode ? '1px solid #2a4a6f' : '1px solid #dee2e6',
    },
    input: {
      backgroundColor: darkMode ? '#ffffff' : '#ffffff',
      color: darkMode ? '#212529' : '#212529',
      border: darkMode ? '1px solid #3a5a7f' : '1px solid #ced4da',
    },
    sendButton: {
      backgroundColor: darkMode ? '#FEB97E' : '#102F51', 
      borderColor: darkMode ? '#102F51' : '#102F51',
      width: '40px',
      height: '40px',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyChat: {
      color: darkMode ? '#a0aec0' : '#6c757d',
    },
    emptyIcon: {
      color: darkMode ? '#2a4a6f' : '#dee2e6',
    },
    userBubble: {
      backgroundColor: darkMode ? '#FEB97E' : '#102F51', // Green for dark mode, dark blue for light
    },
    botBubble: {
      backgroundColor: darkMode ? '#1a3a5f' : '#ffffff',
      borderColor: darkMode ? '#2a4a6f' : '#e9ecef',
    },
    iconColor: {
      color: '#ffffff'
    }
  };

  return (
    <div className="position-fixed bottom-0 end-0 m-3" style={{ zIndex: 9999 }}>
      {/* Floating Chat Button */}
      <div 
        className="chat-button-wrapper"
        style={{ 
          width: '70px', 
          height: '70px', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          ...themeStyles.chatButton
        }}
        onClick={toggleChat}
      >
        {isOpen ? (
          <FiX size={28} color="#ffffff" />
        ) : (
          <div className="d-flex align-items-center justify-content-center">
            <Image 
              src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" 
              alt="Medical Bot" 
              width={40} 
              height={40} 
              className="bot-icon"
            />
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div 
        className={`position-absolute bottom-100 end-0 mb-2 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        style={{ 
          width: '350px', 
          transition: 'all 0.3s ease',
          visibility: isOpen ? 'visible' : 'hidden',
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)'
        }}
      >
        <Card className="border-0 shadow" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <Card.Header style={themeStyles.cardHeader}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <FaLeaf size={24} color={darkMode ? '#FCB77C' : '#ffffff'} className="me-2" />
                <h5 className="mb-0">Care+ Assistant</h5>
              </div>
              <div className="d-flex align-items-center">
                {/* Dark mode toggle button */}
                <Button 
                  variant="link" 
                  className="p-1 me-2 text-white"
                  onClick={toggleDarkMode}
                  title={darkMode ? "Light mode" : "Dark mode"}
                >
                  {darkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
                </Button>
                
                {/* Clear chat button */}
                <Button 
                  variant="link" 
                  className="p-1 me-2 text-white"
                  onClick={clearChat}
                  title="Clear chat"
                >
                  <FiTrash2 size={20} />
                </Button>
                
                {/* Close chat button */}
                <Button 
                  variant="link" 
                  className="p-1 text-white"
                  onClick={toggleChat}
                  title="Close chat"
                >
                  <FiX size={20} />
                </Button>
              </div>
            </div>
          </Card.Header>
          
          <Card.Body 
            ref={chatBodyRef} 
            className="p-3"
            style={{ 
              height: '350px', 
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: darkMode ? '#2a4a6f #1a3a5f' : '#ccc transparent',
              ...themeStyles.cardBody
            }}
          >
            {chatHistory.length === 0 ? (
              <div className="text-center py-5" style={themeStyles.emptyChat}>
                <div className="mb-3 d-flex justify-content-center">
                  <div className="chat-bot-avatar" style={{ backgroundColor: darkMode ? 'rgba(124, 170, 95, 0.2)' : 'rgba(16, 47, 81, 0.1)' }}>
                    <FaRobot size={48} color={darkMode ? '#FBB77C' : '#102F51'} style={{ opacity: 0.7 }} />
                  </div>
                </div>
                <h5>Welcome to Care+ Medical Assistant</h5>
                <p className="mt-2">How can I help you with your medical questions today?</p>
                <div className="mt-4">
                  <Button 
                    variant={darkMode ? "outline-warning" : "outline-secondary"} 
                    size="sm" 
                    className="me-2 mb-2"
                    onClick={() => setUserInput("What medications are good for headaches?")}
                  >
                    Headache medications
                  </Button>
                  <Button 
                    variant={darkMode ? "outline-warning" : "outline-secondary"} 
                    size="sm" 
                    className="me-2 mb-2"
                    onClick={() => setUserInput("How to treat a common cold?")}
                  >
                    Cold remedies
                  </Button>
                  <Button 
                    variant={darkMode ? "outline-warning" : "outline-secondary"} 
                    size="sm" 
                    className="me-2 mb-2"
                    onClick={() => setUserInput("What are the symptoms of high blood pressure?")}
                  >
                    Blood pressure symptoms
                  </Button>
                </div>
              </div>
            ) : (
              <ChatHistory 
                chatHistory={chatHistory} 
                darkMode={darkMode} 
                userBubbleStyle={themeStyles.userBubble}
                botBubbleStyle={themeStyles.botBubble}
              />
            )}
            
            {isLoading && (
              <div className="d-flex align-items-center mt-3 ms-2">
                <div className="typing-indicator">
                  <div className="typing-bubble" style={{ backgroundColor: darkMode ? '#a0aec0' : '#6c757d' }}></div>
                  <div className="typing-bubble" style={{ backgroundColor: darkMode ? '#a0aec0' : '#6c757d' }}></div>
                  <div className="typing-bubble" style={{ backgroundColor: darkMode ? '#a0aec0' : '#6c757d' }}></div>
                </div>
              </div>
            )}
          </Card.Body>
          
          <Card.Footer className="p-2" style={themeStyles.cardFooter}>
            <Form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
              <div className="d-flex">
                <Form.Control
                  ref={inputRef}
                  type="text"
                  placeholder="Type your question here..."
                  value={userInput}
                  onChange={handleUserInput}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="me-2 rounded-pill"
                  style={themeStyles.input}
                />
                <Button 
                  style={themeStyles.sendButton}
                  onClick={sendMessage}
                  disabled={isLoading || userInput.trim() === ""}
                  className="rounded-circle"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <FiSend size={18} color="#ffffff" />
                  )}
                </Button>
              </div>
            </Form>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default ChatBot;
