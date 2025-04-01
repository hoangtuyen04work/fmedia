import React, { useEffect, useRef, useState } from "react";
import "../styles/ChatWindow.scss"; // Import file SCSS đã tách
import { IoSend, IoImageOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { getConversation } from "../services/conversationService";

function ChatWindow({ conversationId, contact, onClose }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Lấy 10 tin nhắn cuối ban đầu
  const chatBodyRef = useRef(null);
  const shouldScrollToBottom = useRef(true); // Biến kiểm soát cuộn
  const [size, setSize] = useState({ width: 300, height: 400 });
  const [resizing, setResizing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const token = useSelector((state) => state.user.user.token);
  const [page, setPage] = useState(0);
  const sizePage = 10;

  const handleMouseDown = (e) => {
    setResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (resizing) {
      setSize((prevSize) => ({
        width: Math.max(250, prevSize.width + e.movementX),
        height: Math.max(300, prevSize.height + e.movementY),
      }));
    }
  };

  const handleMouseUp = () => {
    setResizing(false);
  };


  const handleScroll = () => {
    if (chatBodyRef.current.scrollTop === 0) {
      shouldScrollToBottom.current = false;
      const previousScrollHeight = chatBodyRef.current.scrollHeight;
      setMessages((prevMessages) => [...fakeMessagess, ...prevMessages]);
      setTimeout(() => {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight - previousScrollHeight;
      }, 0);
    }
  };
  

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        handleSendMessageImage(reader.result); // Gửi ảnh ngay sau khi chọn
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessageImage = (imageUrl) => {
    const newMessage = {
      id: `msg${fakeMessages.length + 1}`,
      content: null,
      image: imageUrl,
      reaction: null,
      state: "sent",
      creationTime: new Date().toISOString(),
      updateTime: null,
      sender: "me",
    };
    shouldScrollToBottom.current = true;
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages.slice(-10));
    fakeMessages.push(newMessage);
    setSelectedImage(null); // Reset ảnh đã chọn
  };

  const handleSendMessage = (e) => {
    if ((e.key === "Enter" || e.type === "click") && message.trim()) {
      console.log("message", message);
      shouldScrollToBottom.current = true;
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages.slice(-10));
      setMessage("");
      // fakeMessages.push(newMessage);
    }
  };
  
  const getMessages = async () => {
    const response = await getConversation(token, conversationId, page, sizePage);
    console.log(response);
  }
  
  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    if (resizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizing]);
  useEffect(() => {
    if (shouldScrollToBottom.current && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-window" style={{ width: size.width, height: size.height }}>
      <div className="chat-window__header">
        <span>{contact}</span>
        <button className="chat-window__close" onClick={onClose}>
          ×
        </button>
      </div>
      <div
        className="chat-window__body"
        ref={chatBodyRef}
        onScroll={handleScroll}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-window__message ${
              msg.sender === "me" ? "sent" : "received"
            }`}
          >
            <div>{msg.content}</div>
            {msg.image && (
              <img
                src={msg.image}
                alt="Attached"
                style={{ maxWidth: "100%", borderRadius: "5px", marginTop: "5px" }}
              />
            )}
            {msg.reaction && (
              <span
                style={{ fontSize: "12px", marginTop: "5px", display: "block" }}
              >
                {msg.reaction}
              </span>
            )}
            <div style={{ fontSize: "10px", opacity: 0.7 }}>
              {new Date(msg.creationTime).toLocaleTimeString()} - {msg.state}
            </div>
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
        <label htmlFor="image-upload" className="image-upload">
          <IoImageOutline />
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </label>
        <div className="send" onClick={handleSendMessage}>
          <IoSend />
        </div>
      </div>
      <div className="resize-handle" onMouseDown={handleMouseDown}></div>
    </div>
  );
}

export default ChatWindow;