import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Post from "./Post";
import UserProfileBasic from "./UserProfileBasic";
import "../styles/CenterSearch.scss";
import { useSelector } from "react-redux";
import { searchPost, searchUser } from "../services/searchservice";
import { acceptFriendRequest, cancelFriendRequest, sendFriendRequest } from "../services/friendService";

function CenterSearch() {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = useRef([]);
  const observerRef = useRef(null);
  const lastElementRef = useRef(null);
  const size = 10;
  const token = useSelector((state) => state.user.token);

  const handleFriendAction = async (status, friendId) => {
    switch (status) {
      case "PENDING":
        try {
          const data = await acceptFriendRequest(token, friendId);
          if (data.data.data === true) {
            setSearchResults((prevResults) =>
              prevResults.map((user) =>
                user.userId === friendId
                  ? { ...user, friendship: "ACCEPTED" }
                  : user
              )
            );
          }
        } catch (error) {
          console.error("Error sending friend request:", error);
        }        break;
      case "ACCEPTED":
        try {
          const data = await cancelFriendRequest(token, friendId);
          if (data.data.data === true) {
            setSearchResults((prevResults) =>
              prevResults.map((user) =>
                user.userId === friendId
                  ? { ...user, friendship: null }
                  : user
              )
            );
          }
        } catch (error) {
          console.error("Error sending friend request:", error);
        }        break;
      default:
        try {
          const data = await sendFriendRequest(token, friendId);
          if (data.data.data === true) {
            setSearchResults((prevResults) =>
              prevResults.map((user) =>
                user.userId === friendId
                  ? { ...user, friendship: "PENDING" }
                  : user
              )
            );
          }
        } catch (error) {
          console.error("Error sending friend request:", error);
        }
        break;
    }
  };

  const findUser = async (searchValue, pageNum) => {
    setIsLoading(true);
    try {
      const data = await searchUser(token, searchValue, pageNum, size);
      const newResults = data.data.data.content;
      setSearchResults((prev) => [...prev, ...newResults]);
      setHasMore(newResults.length >= size);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setIsLoading(false);
  };

  const findPost = async (searchValue, pageNum) => {
    setIsLoading(true);
    try {
      const data = await searchPost(token, searchValue, pageNum);
      const newResults = data.data.data.content;
      setSearchResults((prev) => [...prev, ...newResults]);
      setHasMore(newResults.length > 0);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const { searchType, searchValue } = location.state || {};
    if (!searchType || !searchValue) return;
  
    if (page === 0) {
      setSearchResults([]);
      setHasMore(true);
    }
  
    if (searchType === "post") {
      findPost(searchValue, page);
    } else if (searchType === "user") {
      findUser(searchValue, page);
    }
  }, [location.state, page]);

  // Animation observer
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

  const lastElementObserver = useCallback(
  (node) => {
    if (isLoading || !hasMore) return; // Thêm kiểm tra hasMore
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  },
  [isLoading, hasMore]
);



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
          {searchResults.map((post, index) => {
            if (searchResults.length === index + 1) {
              return (
                <div
                  key={post.id}
                  ref={(el) => {
                    resultsRef.current[index] = el;
                    lastElementRef.current = el;
                    lastElementObserver(el);
                  }}
                  className="scroll-animation"
                >
                  <Post
                    avatarLink={post.avatarLink}
                    customId={post.customId}
                    userName={post.userName}
                    creationDate={post.creationDate}
                    content={post.content}
                    imageLink={post.imageLink}
                  />
                </div>
              );
            }
            return (
              <div
                key={post.id}
                ref={(el) => (resultsRef.current[index] = el)}
                className="scroll-animation"
              >
                <Post
                  avatarLink={post.avatarLink}
                  customId={post.customId}
                  userName={post.userName}
                  creationDate={post.creationDate}
                  content={post.content}
                  imageLink={post.imageLink}
                />
              </div>
            );
          })}
        </div>
      )}

      {searchType === "user" && searchResults.length > 0 && (
        <div className="search-center__results">
          {searchResults.map((user, index) => {
            if (searchResults.length === index + 1) {
              return (
                <div
                  key={index}
                  ref={(el) => {
                    resultsRef.current[index] = el;
                    lastElementRef.current = el;
                    lastElementObserver(el);
                  }}
                  className="scroll-animation"
                >
                  <UserProfileBasic
                    imageLink={user.imageLink}
                    userName={user.userName}
                    userId={user.userId}
                    customId={user.customId}
                    friendship={user.friendship}
                    onFriendAction={handleFriendAction}
                  />
                </div>
              );
            }
            return (
              <div
                key={index}
                ref={(el) => (resultsRef.current[index] = el)}
                className="scroll-animation"
              >
                <UserProfileBasic
                  imageLink={user.imageLink}
                  userName={user.userName}
                  userId={user.userId}
                  customId={user.customId}
                  friendship={user.friendship}
                  onFriendAction={handleFriendAction}
                />
              </div>
            );
          })}
        </div>
      )}

      {isLoading && <p className="search-center__loading">Loading...</p>}
      {searchResults.length === 0 && searchType && !isLoading && (
        <p className="search-center__no-results">No results found</p>
      )}
      {!hasMore && searchResults.length > 0 && (
        <p className="search-center__end">No more results</p>
      )}
    </div>
  );
}

export default CenterSearch;