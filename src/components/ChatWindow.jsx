import React, { useEffect, useRef, useState } from "react";
import "../styles/ChatWindow.scss";
import { useSelector } from "react-redux";
import { getConversation } from "../services/conversationService";
import MessageForm from "./MessageForm";
import webSocketService from "../services/WebSocketService";

function ChatWindow({
  friendId,
  conversationId,
  contact,
  onClose,
  handleUpdateNewestMessage,
  newMessage, // Nhận tin nhắn mới từ RightBar
}) {
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
  const [fileName, setFileName] = useState();

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
        if (resizeDirection.includes("right"))
          newWidth = Math.max(250, prevSize.width + e.movementX);
        if (resizeDirection.includes("left"))
          newWidth = Math.max(250, prevSize.width - e.movementX);
        if (resizeDirection.includes("bottom"))
          newHeight = Math.max(300, prevSize.height + e.movementY);
        if (resizeDirection.includes("top"))
          newHeight = Math.max(300, prevSize.height - e.movementY);
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

  // Nhận tin nhắn mới từ WebSocket (qua prop newMessage)
  useEffect(() => {
    if (newMessage && newMessage.conversationId === conversationId) {
      const formattedMessage = {
        content: newMessage.content !== "null" ? newMessage.content : null,
        imageLink: newMessage.imageLink || null,
        senderId: newMessage.senderId,
        sendAt: newMessage.sendAt || new Date().toISOString(),
        conversationId: newMessage.conversationId,
      };
      setMessages((prev) => [...prev, formattedMessage]);
      shouldScrollToBottom.current = true;
    }
  }, [newMessage, conversationId]);

  // Image handling
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn một file hình ảnh");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("Kích thước file vượt quá 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      setFileName(file.name);
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (previewImage) {
        const imageBase64 = previewImage.split(",")[1];
        const newMessage = {
          content: message || "null",
          imageBase64: imageBase64,
          fileName: fileName,
          conversationId: conversationId,
          senderId: userId,
          receiverId: [friendId, userId],
        };
        webSocketService.sendMessage(`/app/conversation/${conversationId}`, newMessage);
        setPreviewImage(null);
        setMessage("");
      } else if (message.trim()) {
        const newMessage = {
          content: message,
          imageBase64: null,
          fileName: null,
          conversationId: conversationId,
          senderId: userId,
          receiverId: [friendId, userId],
        };
        webSocketService.sendMessage(`/app/conversation/${conversationId}`, newMessage);
        setMessage("");
      }
    }
  };

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
        {isLoading && <div>Đang tải...</div>}
        {messages.length === 0 && !isLoading && (
          <div className="chat-window__empty">
            <p>Chưa có tin nhắn nào!</p>
            <p>Bắt đầu cuộc trò chuyện với {contact} bằng cách gửi tin nhắn bên dưới.</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={`${msg.sendAt}-${index}`}
            className={`chat-window__message ${msg.senderId === userId ? "sent" : "received"}`}
          >
            {msg.content && <div>{msg.content}</div>}
            {msg.imageLink && (
              <img
                src={msg.imageLink}
                alt="Đính kèm"
                style={{ maxWidth: "100%", borderRadius: "5px", marginTop: "5px" }}
              />
            )}
            <div style={{ fontSize: "10px", opacity: 0.7 }}>
              {new Date(msg.sendAt).toLocaleTimeString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-window__footer">
        <MessageForm
          message={message}
          setMessage={setMessage}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          handleSendMessage={handleSendMessage}
          handleImageChange={handleImageChange}
          fileName={fileName}
        />
      </div>
      <div className="resize-handle top-left" onMouseDown={handleMouseDown("top-left")}></div>
    </div>
  );
}

export default ChatWindow;