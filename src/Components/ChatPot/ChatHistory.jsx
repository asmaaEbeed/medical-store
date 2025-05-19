import React from "react";
import ReactMarkdown from "react-markdown";

const ChatHistory = ({ chatHistory, darkMode = false, userBubbleStyle = {}, botBubbleStyle = {} }) => {
  return (
    <div className="d-flex flex-column">
      {chatHistory.map((chat, index) => (
        <div
          key={index}
          className={`mb-3 ${chat.type === "user" ? "align-self-end" : "align-self-start"}`}
          style={{ maxWidth: '85%' }}
        >
          <div 
            className={`p-3 ${
              chat.type === "user" 
                ? "rounded-3 rounded-bottom-end-0 text-white" 
                : `rounded-3 rounded-bottom-start-0 shadow-sm ${darkMode ? 'border border-secondary' : ''} ${darkMode ? 'text-light' : 'text-dark'}`
            }`}
            style={chat.type === "user" ? userBubbleStyle : botBubbleStyle}
          >
            {chat.type === "bot" ? (
              <div className="markdown">
                <ReactMarkdown>{chat.message}</ReactMarkdown>
              </div>
            ) : (
              <p className="mb-0">{chat.message}</p>
            )}
          </div>
          <div className={`small mt-1 ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
