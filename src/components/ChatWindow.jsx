import React, { useEffect, useRef, useState } from "react";
import "../styles/ChatWindow.scss";
import { IoSend, IoImageOutline, IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { getConversation } from "../services/conversationService";
import { Client } from "@stomp/stompjs";

function ChatWindow({ friendId, conversationId, contact, onClose }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatBodyRef = useRef(null);
  const shouldScrollToBottom = useRef(true);
  const [size, setSize] = useState({ width: 300, height: 400 });
  const [resizeDirection, setResizeDirection] = useState(null);
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.user.id);
  const [page, setPage] = useState(0);
  const sizePage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const stompClientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  // Resize handlers
  const handleMouseDown = (direction) => (e) => {
    setResizeDirection(direction);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (resizeDirection) {
      setSize((prevSize) => {
        let newWidth = prevSize.width;
        let newHeight = prevSize.height;
        if (resizeDirection.includes("right")) newWidth = Math.max(250, prevSize.width + e.movementX);
        if (resizeDirection.includes("left")) newWidth = Math.max(250, prevSize.width - e.movementX);
        if (resizeDirection.includes("bottom")) newHeight = Math.max(300, prevSize.height + e.movementY);
        if (resizeDirection.includes("top")) newHeight = Math.max(300, prevSize.height - e.movementY);
        return { width: newWidth, height: newHeight };
      });
    }
  };

  const handleMouseUp = () => setResizeDirection(null);

  // Fetch messages
  const fetchMessages = async (pageNum) => {
    try {
      setIsLoading(true);
      const response = await getConversation(token, conversationId, pageNum, sizePage);
      const formattedMessages = response.data.data.map((msg) => ({
        content: msg.content,
        imageLink: msg.imageLink,
        senderId: msg.senderId,
        sendAt: msg.sendAt,
      }));
      return formattedMessages;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const loadInitialMessages = async () => {
    const initialMessages = await fetchMessages(0);
    setMessages(initialMessages.reverse());
  };

  useEffect(() => {
    loadInitialMessages();
  }, [conversationId]);

  const handleScroll = async () => {
    if (chatBodyRef.current.scrollTop === 0 && !isLoading) {
      shouldScrollToBottom.current = false;
      const previousScrollHeight = chatBodyRef.current.scrollHeight;
      const newPage = page + 1;
      const olderMessages = await fetchMessages(newPage);
      if (olderMessages.length > 0) {
        setMessages((prev) => [...olderMessages.reverse(), ...prev]);
        setPage(newPage);
        setTimeout(() => {
          chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight - previousScrollHeight;
        }, 0);
      }
    }
  };

  // Image handling
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessageImage = () => {
    if (previewImage && stompClientRef.current && stompClientRef.current.connected) {
      const newMessage = { content: message || null, imageFile: previewImage,  conversationId: conversationId, senderId: userId , receiverId : [friendId, userId] };
      stompClientRef.current.publish({
        destination: `/app/conversation/${conversationId}`,
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(newMessage),
      });
      setPreviewImage(null);
      setMessage("");
    }
  };

  const handleSendMessage = (e) => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.error("STOMP client is not connected!");
      alert("Cannot send message: WebSocket is not connected.");
      return;
    }
    if (e.key === "Enter" || e.type === "click") {
      if (previewImage) {
        handleSendMessageImage();
      } else if (message.trim()) {
        const newMessage = { content: message, imageFile: null, conversationId: conversationId, senderId: userId, receiverId : [friendId, userId] };
        stompClientRef.current.publish({
          destination: `/app/conversation/${conversationId}`,
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(newMessage),
        });
        setMessage("");
      }
    }
  };


  const connectWebSocket = () => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      console.log("WebSocket already connected");
      setIsConnected(true);
      return;
    }
    const stompClient = new Client({
      brokerURL: `ws://localhost:8888/media/ws?token=${token}`, // Gửi token qua URL
    });
  
    stompClient.onConnect = () => {
      setIsConnected(true);
      stompClient.subscribe(`/user/queue/conversation/messages/${conversationId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        console.log("new", newMessage);
        setMessages((prev) => [...prev, newMessage]);
        shouldScrollToBottom.current = true;
      });
    };
  
    stompClient.onStompError = (error) => {
      console.error("WebSocket connection error:", error);
      setIsConnected(false);
    };
  
    stompClient.activate();
    stompClientRef.current = stompClient;
  };
  

  const disconnectWebSocket = () => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.deactivate();
      setIsConnected(false);
      console.log("Disconnected from WebSocket");
    }
  };

  useEffect(() => {
    if (token && conversationId) {
      connectWebSocket();
      return () => disconnectWebSocket();
    }
  }, [token, conversationId]);

  useEffect(() => {
    if (shouldScrollToBottom.current && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (resizeDirection) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizeDirection]);

  return (
    <div className="chat-window" style={{ width: size.width, height: size.height }}>
      <div className="chat-window__header">
        <span>{contact}</span>
        <button className="chat-window__close" onClick={onClose}>×</button>
      </div>
      <div className="chat-window__body" ref={chatBodyRef} onScroll={handleScroll}>
        {isLoading && <div>Loading...</div>}
        {messages.length === 0 && !isLoading && (
          <div className="chat-window__empty">
            <p>No messages yet!</p>
            <p>Start the conversation with {contact} by sending a message below.</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={`${msg.sendAt}-${index}`}
            className={`chat-window__message ${msg.senderId === userId ? "sent" : "received"}`}
          >
            {msg.content && <div>{msg.content}</div>}
            {msg.imageLink && (
              <img src={msg.imageLink} alt="Attached" style={{ maxWidth: "100%", borderRadius: "5px", marginTop: "5px" }} />
            )}
            <div style={{ fontSize: "10px", opacity: 0.7 }}>{new Date(msg.sendAt).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
      <div className="chat-window__footer">
        {previewImage && (
          <div className="image-preview">
            <img src={previewImage} alt="Preview" />
            <button className="remove-preview" onClick={() => setPreviewImage(null)}>
              <IoClose />
            </button>
          </div>
        )}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleSendMessage}
          placeholder="Type a message..."
        />
        <label htmlFor="image-upload" className="image-upload">
          <IoImageOutline />
          <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
        </label>
        <div className="send" onClick={handleSendMessage}>
          <IoSend />
        </div>
      </div>
      <div className="resize-handle top-left" onMouseDown={handleMouseDown("top-left")}></div>
    </div>
  );
}

export default ChatWindow;