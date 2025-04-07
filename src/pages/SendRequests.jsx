import React from "react";
import "../styles/Home.scss";
import LeftBar from "../components/LeftBar";
import RightBar from "../components/RightBar";
import CenterSendRequests from "../components/CenterSendRequests";

function SendRequests() {
  return (
    <div className="home">
      <LeftBar />
      <main className="home__main">
        <CenterSendRequests/>
      </main>
      <RightBar />
    </div>
  );
}

export default SendRequests;