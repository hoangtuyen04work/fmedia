import React, { useEffect, useState } from "react";
import "../styles/RightBar.scss";
import ChatWindow from "./ChatWindow";
import { useSelector } from "react-redux";
import { getMyFriend } from "../services/friendService";

function RightBar() {
  const [selectedContact, setSelectedContact] = useState(null);
  const token = useSelector((state) => state.user.token);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetchAllFriend();
  }, [])
  
  const fetchAllFriend = async () => {
    const data = await getMyFriend(token);
    setFriends(data.data.data);
  }

  const handleContactClick = (friend) => {
    setSelectedContact(friend);
  };

  const handleCloseChat = () => {
    setSelectedContact(null);
  };

  return (
    <div className="rightbar">
      <div className="rightbar__section">
        <h3 className="rightbar__title">Contacts</h3>
        <ul className="rightbar__list">
          {friends.map((friend) => (
            <li
              key={friend.userId}
              className="rightbar__item"
              onClick={() => handleContactClick(friend)}
              style={{ cursor: "pointer" }}
            >
              <span className="rightbar__icon">
                {friend.imageLink ? (
                  <img
                    src={friend.imageLink}
                    alt={friend.userName}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  "👤"
                )}
              </span>
              <div className="rightbar__text-wrapper">
                <span className="rightbar__text">{friend.userName}</span>
                <span className="rightbar__custom-id">{friend.customId}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {selectedContact && (
        <ChatWindow 
          contact={selectedContact.userName} 
          userId={selectedContact.userId}
          onClose={handleCloseChat} 
        />
      )}
    </div>
  );
}

export default RightBar;