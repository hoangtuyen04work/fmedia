import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import UserProfileBasic from "../components/UserProfileBasic";
import { getFriendsList, cancelFriendRequest } from "../services/friendService";
import "../styles/CenterSearch.scss";

function CenterFriendsList() {
  const [friends, setFriends] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = useRef([]);
  const observerRef = useRef(null);
  const lastElementRef = useRef(null);
  const size = 10;
  const token = useSelector((state) => state.user.token);

  const fetchFriendsList = async (pageNum) => {
    setIsLoading(true);
    try {
      const data = await getFriendsList(token, pageNum, size);
      console.log(data);
      const newFriends = data.data.data.content;

      setFriends((prev) => [...prev, ...newFriends]);
      setHasMore(newFriends.length >= size);
    } catch (error) {
      console.error("Error fetching friends list:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (page === 0) {
      setFriends([]);
      setHasMore(true);
    }
    fetchFriendsList(page);
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
  }, [friends]);

  const lastElementObserver = useCallback(
    (node) => {
      if (isLoading || !hasMore) return;
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

  const handleFriendAction = async (status, friendId) => {
    if (status === "ACCEPTED") {
      try {
        const data = await cancelFriendRequest(token, friendId);
        if (data.data.data === true) {
          setFriends((prev) =>
            prev.filter((user) => user.userId !== friendId) // Xóa khỏi danh sách
          );
        }
      } catch (error) {
        console.error("Error removing friend:", error);
      }
    }
  };

  return (
    <div className="search-center">
      <h2 className="search-center__title">Danh sách bạn bè</h2>

      {friends.length > 0 && (
        <div className="search-center__results">
          {friends.map((user, index) => {
            if (friends.length === index + 1) {
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

      {isLoading && <p className="search-center__loading">Đang tải...</p>}
      {friends.length === 0 && !isLoading && (
        <p className="search-center__no-results">Chưa có bạn bè nào</p>
      )}
      {!hasMore && friends.length > 0 && (
        <p className="search-center__end">Đã hiển thị tất cả bạn bè</p>
      )}
    </div>
  );
}

export default CenterFriendsList;