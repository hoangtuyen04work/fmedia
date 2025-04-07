import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import UserProfileBasic from "../components/UserProfileBasic";
import { getSentRequests, cancelFriendRequest } from "../services/friendService";
import "../styles/CenterSearch.scss";

function CenterSentRequests() {
  const [sentRequests, setSentRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = useRef([]);
  const observerRef = useRef(null);
  const lastElementRef = useRef(null);
  const size = 10;
  const token = useSelector((state) => state.user.token);

  const fetchSentRequests = async (pageNum) => {
    setIsLoading(true);
    try {
      const data = await getSentRequests(token, pageNum, size);
      console.log(data);
      const newRequests = data.data.data.content;
      setSentRequests((prev) => [...prev, ...newRequests]);
      setHasMore(newRequests.length >= size);
    } catch (error) {
      console.error("Error fetching sent requests:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (page === 0) {
      setSentRequests([]);
      setHasMore(true);
    }
    fetchSentRequests(page);
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
  }, [sentRequests]);

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
    if (status === "PENDING") {
      try {
        const data = await cancelFriendRequest(token, friendId);
        if (data.data.data === true) {
          setSentRequests((prev) =>
            prev.filter((user) => user.userId !== friendId) // Xóa khỏi danh sách
          );
        }
      } catch (error) {
        console.error("Error canceling sent request:", error);
      }
    }
  };

  return (
    <div className="search-center">
      <h2 className="search-center__title">Lời mời đã gửi</h2>

      {sentRequests.length > 0 && (
        <div className="search-center__results">
          {sentRequests.map((user, index) => {
            if (sentRequests.length === index + 1) {
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
      {sentRequests.length === 0 && !isLoading && (
        <p className="search-center__no-results">Chưa gửi lời mời nào</p>
      )}
      {!hasMore && sentRequests.length > 0 && (
        <p className="search-center__end">Đã hiển thị tất cả lời mời</p>
      )}
    </div>
  );
}

export default CenterSentRequests;