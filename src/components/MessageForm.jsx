import React from "react";
import { IoSend, IoImageOutline, IoClose } from "react-icons/io5";
import "../styles/MessageForm.scss";

function MessageForm({
  message,
  setMessage,
  previewImage,
  setPreviewImage,
  handleSendMessage,
  handleImageChange,
  fileName,
}) {
  return (
    <div className="message-form">
      {previewImage && (
        <div className="image-preview">
          <img src={previewImage} alt="Xem trước" />
          <span className="file-name">{fileName}</span>
          <button
            className="remove-preview"
            onClick={() => setPreviewImage(null)}
            aria-label="Xóa ảnh xem trước"
          >
            <IoClose />
          </button>
        </div>
      )}
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleSendMessage}
          placeholder="Nhập tin nhắn..."
          className="message-input"
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
        <button
          className="send-button"
          onClick={handleSendMessage}
          aria-label="Gửi tin nhắn"
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
}

export default MessageForm;