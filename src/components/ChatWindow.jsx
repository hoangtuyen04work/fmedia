import React from "react";
import "../styles/ChatWindow.scss"; // Add styles for the chat window

function ChatWindow({ contact, onClose }) {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);

  const handleSendMessage = (e) => {
    if (e.key === "Enter" && message.trim()) {
      setMessages([...messages, { text: message, sender: "me" }]);
      setMessage("");
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-window__header">
        <span>{contact}</span>
        <button className="chat-window__close" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="chat-window__body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-window__message ${
              msg.sender === "me" ? "sent" : "received"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-window__footer">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleSendMessage}
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
}

export default ChatWindow;