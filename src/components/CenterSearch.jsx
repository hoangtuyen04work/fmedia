// src/components/SearchCenter.jsx
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Post from "./Post";
import UserProfileBasic from "./UserProfileBasic";
import "../styles/CenterSearch.scss"; // Note: Changed from CenterSearch.scss to match your request

function CenterSearch() {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const resultsRef = useRef([]); // Reference to track search results

  // Mock data for demonstration (replace with API calls in production)
  const mockPosts = Array.from({ length: 10 }, (_, index) => ({
    profilePic: "../../public/download.jpg",
    username: `User ${index + 1}`,
    time: `${index + 1} hrs ago`,
    text: `This is a sample post ${index + 1} containing search term`,
    image: index % 2 === 0 ? "../../public/download.jpg" : null,
  }));

  const mockUsers = Array.from({ length: 10 }, (_, index) => ({
    profilePic: "../../public/download.jpg",
    username: `User ${index + 1}`,
    userId: `@user${index + 1}`,
    friendStatus: "none"
  }));
  const handleFriendAction = (status) => {
    switch (status) {
      case "none":
        console.log("Add friend clicked!");
        // Logic kết bạn
        break;
      case "pending":
        console.log("Cancel friend request clicked!");
        // Logic hủy lời mời
        break;
      case "friends":
        console.log("Unfriend clicked!");
        // Logic hủy kết bạn
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    const { searchType, searchValue } = location.state || {};
    
    if (searchType && searchValue) {
      if (searchType === "post") {
        setSearchResults(mockPosts);
      } else if (searchType === "user") {
        setSearchResults(mockUsers);
      }
    }
  }, [location.state]);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.3 }
    );

    resultsRef.current.forEach((result) => {
      if (result) observer.observe(result);
    });

    return () => observer.disconnect();
  }, [searchResults]);

  const { searchType, searchValue } = location.state || {};

  return (
    <div className="search-center">
      <h2 className="search-center__title">
        {searchType 
          ? `Search Results for "${searchValue}" in ${searchType}s`
          : "No Search Performed"}
      </h2>
      
      {searchType === "post" && searchResults.length > 0 && (
        <div className="search-center__results">
          {searchResults.map((post, index) => (
            <div
              key={index}
              ref={(el) => (resultsRef.current[index] = el)}
              className="scroll-animation"
            >
              <Post
                profilePic={post.profilePic}
                username={post.username}
                time={post.time}
                text={post.text}
                image={post.image}
              />
            </div>
          ))}
        </div>
      )}

      {searchType === "user" && searchResults.length > 0 && (
        <div className="search-center__results">
          {searchResults.map((user, index) => (
            <div
              key={index}
              ref={(el) => (resultsRef.current[index] = el)}
              className="scroll-animation"
            >
              <UserProfileBasic
                profilePic={user.profilePic}
                username={user.username}
                userId={user.userId}
                friendStatus={user.friendStatus}
                onFriendAction={handleFriendAction}

              />
            </div>
          ))}
        </div>
      )}

      {searchResults.length === 0 && searchType && (
        <p className="search-center__no-results">No results found</p>
      )}
    </div>
  );
}

export default CenterSearch;