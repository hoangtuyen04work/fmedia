import React, { useState } from "react";
import "../styles/RightBar.scss";
import ChatWindow from "./ChatWindow";

function RightBar() {
  const [selectedContact, setSelectedContact] = useState(null);

  const contacts = [
    "John Doe",
    "Jane Smith",
    "Alex Johnson",
    // Add more unique contacts or fetch from a data source
  ];

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
  };

  const handleCloseChat = () => {
    setSelectedContact(null);
  };

  return (
    <div className="rightbar">
      <div className="rightbar__section">
        <h3 className="rightbar__title">Contacts</h3>
        <ul className="rightbar__list">
          {contacts.map((contact, index) => (
            <li
              key={index}
              className="rightbar__item"
              onClick={() => handleContactClick(contact)}
              style={{ cursor: "pointer" }}
            >
              <span className="rightbar__icon">👤</span>
              <span className="rightbar__text">{contact}</span>
            </li>
          ))}
        </ul>
      </div>
      {selectedContact && (
        <ChatWindow contact={selectedContact} onClose={handleCloseChat} />
      )}
    </div>
  );
}

export default RightBar;