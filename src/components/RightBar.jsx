import React, { useEffect, useState } from "react";
import "../styles/RightBar.scss";
import ChatWindow from "./ChatWindow";
import ContactList from "./ContactList";
import { useSelector } from "react-redux";
import { getMyFriend } from "../services/friendService";
import webSocketService from "../services/WebSocketService";

function RightBar() {
  const [selectedContact, setSelectedContact] = useState(null);
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.user.id);
  const [friends, setFriends] = useState([]);
  const [newMessages, setNewMessages] = useState({});

  useEffect(() => {
    fetchAllFriend();
  }, []);

  const fetchAllFriend = async () => {
    try {
      const data = await getMyFriend(token);
      setFriends(data.data.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  // Kết nối WebSocket một lần khi component mount
  useEffect(() => {
    if (token && userId) {
      webSocketService.connect(
        token,
        userId,
        () => {
          console.log("WebSocket connected, subscribing to conversations...");
        },
        (error) => {
          console.error("WebSocket connection failed:", error);
        }
      );

      return () => {
        webSocketService.disconnect();
      };
    }
  }, [token, userId]); 

  useEffect(() => {
    if (webSocketService.isConnected() && friends.length > 0) {
      friends.forEach((friend) => {
        if (friend.conversationId) {
          webSocketService.subscribe(friend.conversationId, userId, handleNewMessage);
        }
      });

      return () => {
        friends.forEach((friend) => {
          if (friend.conversationId) {
            webSocketService.unsubscribe(friend.conversationId);
          }
        });
      };
    }
  }, [friends]); // Phụ thuộc vào friends để subscribe/unsubscribe

  const handleNewMessage = (newMessage) => {
    console.log("New message received:", newMessage);
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.conversationId === newMessage.conversationId
          ? {
              ...friend,
              newestMessage: newMessage.content !== "null" ? newMessage.content : "Hình ảnh",
              sendTime: newMessage.sendAt || new Date().toISOString(),
            }
          : friend
      )
    );

    setNewMessages((prev) => ({
      ...prev,
      [newMessage.conversationId]: newMessage,
    }));
  };

  const handleContactClick = (friend) => {
    setSelectedContact(friend);
  };

  const handleCloseChat = () => {
    setSelectedContact(null);
  };

  const handleUpdateNewestMessage = (newMessage) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.conversationId === newMessage.conversationId
          ? {
              ...friend,
              newestMessage: newMessage.content !== "null" ? newMessage.content : "Hình ảnh",
              sendTime: newMessage.sendAt || new Date().toISOString(),
            }
          : friend
      )
    );

    setNewMessages((prev) => ({
      ...prev,
      [newMessage.conversationId]: newMessage,
    }));
  };

  return (
    <div className="rightbar">
      <ContactList friends={friends} onContactClick={handleContactClick} />
      {selectedContact && (
        <ChatWindow
          conversationId={selectedContact.conversationId}
          friendId={selectedContact.userId}
          contact={selectedContact.userName}
          userId={selectedContact.userId}
          onClose={handleCloseChat}
          handleUpdateNewestMessage={handleUpdateNewestMessage}
          newMessage={newMessages[selectedContact.conversationId]}
        />
      )}
    </div>
  );
}

export default RightBar;