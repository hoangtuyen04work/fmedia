import React from "react";
import "../styles/Home.scss";
import LeftBar from "../components/LeftBar";
import RightBar from "../components/RightBar";
import CenterFriendsRequests from "../components/CenterFriendsRequests";


function FriendsRequests() {
  return (
    <div className="home">
      <LeftBar />
      <main className="home__main">
        <CenterFriendsRequests/>
      </main>
      <RightBar />
    </div>
  );
}

export default FriendsRequests;