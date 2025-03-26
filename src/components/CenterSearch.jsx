import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Post from "./Post";
import UserProfileBasic from "./UserProfileBasic";
import "../styles/CenterSearch.scss";
import { useSelector } from "react-redux";
import { searchPost, searchUser } from "../services/searchservice";

function CenterSearch() {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = useRef([]);
  const observerRef = useRef(null);
  const lastElementRef = useRef(null);

  const token = useSelector((state) => state.user.token);

  const handleFriendAction = (status) => {
    switch (status) {
      case "none":
        console.log("Add friend clicked!");
        break;
      case "pending":
        console.log("Cancel friend request clicked!");
        break;
      case "friends":
        console.log("Unfriend clicked!");
        break;
      default:
        break;
    }
  };

  const findUser = async (searchValue, pageNum) => {
    setIsLoading(true);
    try {
      const data = await searchUser(token, searchValue, pageNum);
      const newResults = data.data.data.content;
      setSearchResults((prev) => [...prev, ...newResults]);
      setHasMore(newResults.length > 0);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setIsLoading(false);
  };

  const findPost = async (searchValue, pageNum) => {
    setIsLoading(true);
    try {
      const data = await searchPost(token, searchValue, pageNum);
      console.log("data", data, pageNum)
      const newResults = data.data.data.content;
      setSearchResults((prev) => [...prev, ...newResults]);
      setHasMore(newResults.length > 0);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setIsLoading(false);
  };

  // Reset search when search parameters change
  useEffect(() => {
    const { searchType, searchValue } = location.state || {};
    if (searchType && searchValue) {
      setSearchResults([]);
      setPage(0);
      setHasMore(true);
      if (searchType === "post") {
        findPost(searchValue, 0);
      } else if (searchType === "user") {
        findUser(searchValue, 0);
      }
    }
  }, [location.state]);


  const lastElementObserver = useCallback(
    (node) => {
      if (isLoading) return;
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

  // Load more results when page changes
  useEffect(() => {
    const { searchType, searchValue } = location.state || {};
    if (page > 0 && searchType && searchValue) {
      console.log("dfsdf", page);
      if (searchType === "post") {
        findPost(searchValue, page);
      } else if (searchType === "user") {
        findUser(searchValue, page);
      }
    }
  }, [page]);

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
                    friendStatus={user.friendStatus}
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
                  friendStatus={user.friendStatus}
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