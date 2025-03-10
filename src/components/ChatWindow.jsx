import React, { useEffect, useRef, useState } from "react";
import "../styles/ChatWindow.scss"; // Import file SCSS đã tách
import { IoSend, IoImageOutline } from "react-icons/io5";

function ChatWindow({ contact, onClose }) {
  const fakeMessages = [
    {
      id: "msg1",
      content: "Tin nhắn 1",
      image: null,
      reaction: null,
      state: "read",
      creationTime: "2025-03-10T09:50:00Z",
      updateTime: null,
      sender: "friend",
    },
    {
      id: "msg2",
      content: "Tin nhắn 2",
      image: null,
      reaction: null,
      state: "read",
      creationTime: "2025-03-10T09:51:00Z",
      updateTime: null,
      sender: "me",
    },
    {
      id: "msg3",
      content: "Tin nhắn 3",
      image: null,
      reaction: null,
      state: "read",
      creationTime: "2025-03-10T09:52:00Z",
      updateTime: null,
      sender: "friend",
    },
    {
      id: "msg4",
      content: "Tin nhắn 4",
      image: null,
      reaction: null,
      state: "read",
      creationTime: "2025-03-10T09:53:00Z",
      updateTime: null,
      sender: "me",
    },
    {
      id: "msg4",
      content: "Tin nhắn 4",
      image: "../../public/download.jpg",
      reaction: null,
      state: "read",
      creationTime: "2025-03-10T09:53:00Z",
      updateTime: null,
      sender: "me",
    },
  ];
  const fakeMessagess = [
    {
      id: "msg11",
      content: "Xin chào! Bạn khỏe không?",
      image: null,
      reaction: "👍",
      state: "read",
      creationTime: "2025-03-10T10:00:00Z",
      updateTime: null,
      sender: "me",
    },
    {
      id: "msg12",
      content: "Mình khỏe, còn bạn?",
      image: null,
      reaction: null,
      state: "delivered",
      creationTime: "2025-03-10T10:01:00Z",
      updateTime: null,
      sender: "friend",
    },
    {
      id: "msg13",
      content: "Nhìn bức ảnh này nhé!",
      image: "../../public/download.jpg",
      reaction: "❤️",
      state: "sent",
      creationTime: "2025-03-10T10:02:00Z",
      updateTime: "2025-03-10T10:03:00Z",
      sender: "me",
    },
  ];
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(fakeMessages.slice(-10)); // Lấy 10 tin nhắn cuối ban đầu
  const chatBodyRef = useRef(null);
  const shouldScrollToBottom = useRef(true); // Biến kiểm soát cuộn
  const [size, setSize] = useState({ width: 300, height: 400 });
  const [resizing, setResizing] = useState(false);

  // Bắt đầu kéo thay đổi kích thước
  const handleMouseDown = (e) => {
    setResizing(true);
    e.preventDefault();
  };

  // Cập nhật kích thước cửa sổ khi kéo
  const handleMouseMove = (e) => {
    if (resizing) {
      setSize((prevSize) => ({
        width: Math.max(250, prevSize.width + e.movementX),
        height: Math.max(300, prevSize.height + e.movementY),
      }));
    }
  };

  // Dừng resize khi thả chuột
  const handleMouseUp = () => {
    setResizing(false);
  };

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
  // Cuộn xuống tin nhắn mới nhất khi có tin nhắn mới
  useEffect(() => {
    if (shouldScrollToBottom.current && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Xử lý khi cuộn lên để tải tin nhắn cũ
  const handleScroll = () => {
    if (chatBodyRef.current.scrollTop === 0) {
      shouldScrollToBottom.current = false;
  
      // Lưu chiều cao trước khi cập nhật
      const previousScrollHeight = chatBodyRef.current.scrollHeight;
  
      // Thêm fakeMessages vào đầu danh sách tin nhắn
      setMessages((prevMessages) => [...fakeMessagess, ...prevMessages]);
  
      // Đợi React cập nhật DOM rồi mới chỉnh vị trí cuộn
      setTimeout(() => {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight - previousScrollHeight;
      }, 0);
    }
  };
  
  

  const [selectedImage, setSelectedImage] = useState(null);

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
      const newMessage = {
        id: `msg${fakeMessages.length + 1}`,
        content: message,
        image: null,
        reaction: null,
        state: "sent",
        creationTime: new Date().toISOString(),
        updateTime: null,
        sender: "me",
      };
      shouldScrollToBottom.current = true;
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages.slice(-10));
      setMessage("");
      fakeMessages.push(newMessage);
    }
  };

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