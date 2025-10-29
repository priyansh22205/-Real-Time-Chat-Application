import React from "react";
import Chat from "./Chat";

export default function App() {
  // You can run two browser windows and set different names to simulate two users
  return (
    <div className="app-wrapper">
      <div className="chat-container">
        <Chat />
      </div>
    </div>
  );
}
