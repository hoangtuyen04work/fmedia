import React from "react";
import { Routes, Route } from "react-router-dom";
import "../styles/Home.scss";
import LeftBar from "../components/LeftBar";
import RightBar from "../components/RightBar";
import CenterFriendsList from "../components/CenterFriendsList";

function FriendsList() {
  return (
    <div className="home">
      <LeftBar />
      <main className="home__main">
        <CenterFriendsList/>
      </main>
      <RightBar />
    </div>
  );
}

export default FriendsList;