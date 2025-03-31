// src/components/Post.jsx
import React, { useEffect, useState } from "react";
import "../styles/Post.scss";
import { like, unLike } from "../services/postService";
import { useSelector } from "react-redux";
import { getAllComment, sendComment } from "../services/commentService";



function Post({id,  avatarLink, customId, userName, creationDate,  content, imageLink }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState("");
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.user.userId);

  useEffect(() => {
    console.log(id,  avatarLink, customId, userName, creationDate,  content, imageLink )
  })
  const handleLikeClick = async () => {
    if (isLiked) {
      setIsLiked(false);
      const request = {
        postId: id,
        userId: userId
      }
      const data = await unLike(token, request);
      console.log("data", data)
      setLikeAnimation("animate-unlike");
    } else {
      const data = await setIsLiked(true);
      console.log("data", data)
      const request = {
        postId: id,
        userId: userId,
        reaction: 'LIKE'
      }
      like(token, request);
      setLikeAnimation("animate-like");
    }
    setTimeout(() => setLikeAnimation(""), 300);
  };

  const handleCommentSubmit = async  () => {
    if (newComment.trim()) {
      const newCommentObj = {
        postId: id,
        content: newComment,
        imageLink: "https://via.placeholder.com/32"
      };
      const data = await sendComment(token, newCommentObj);
      setComments([...comments, data.data.data]);
      setNewComment("");
    }
  };

  const handleOpenComment = async () => {
    setIsCommentModalOpen(true);
    const data = await getAllComment(token, id);
    setComments(data.data.data.content)
  }

  return (
    <div className="post">
      <div className="post__header">
        <img src={avatarLink} alt="User" className="post__pic" />
        <div>
          <span className="post__name">{userName}</span>
          <span className="post__time">{creationDate}</span>
        </div>
      </div>
      <p className="post__text">{content}</p>
      {imageLink && (
        <img
          src={imageLink}
          alt="Post content"
          className="post__image"
        />
      )}
      <div className="post__actions">
        <button
          className={`like-button ${isLiked ? "liked" : ""} ${likeAnimation}`}
          onClick={handleLikeClick}
        >
          👍 Like
        </button>
        <button onClick={handleOpenComment}>💬 Comment</button>
        <button>↪ Share</button>
      </div>

      {isCommentModalOpen && (
        <div className="post__comment-modal">
          <div className="post__comment-modal-content">
            <div className="post__comment-modal-header">
              <h2>Comments</h2>
              <button 
                className="post__comment-modal-close"
                onClick={() => setIsCommentModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="post__comment-modal-post">
              <div className="post__comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="post__comment">
                    <img src={comment.imageLink} alt={comment.userName} className="post__comment-pic" />
                    <div className="post__comment-body">
                      <span className="post__comment-user">{comment.userName}</span>
                      <p className="post__comment-text">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="post__comment-input-area">
              <img 
                src="https://via.placeholder.com/32" 
                alt="Your profile" 
                className="post__comment-pic" 
              />
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="post__comment-textarea"
              />
            <div className="post__comment-buttons">
              <button onClick={handleCommentSubmit}>Post</button>
            </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Post;