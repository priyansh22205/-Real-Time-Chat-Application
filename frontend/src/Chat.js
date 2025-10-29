import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

/*
  Default backend URL: http://localhost:5000
  If deploying backend elsewhere, update the URL below.
*/
const SOCKET_SERVER_URL = "http://localhost:5000";

export default function Chat() {
  const [name, setName] = useState("");
  const [connectedName, setConnectedName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    // create socket connection when component mounts
    socketRef.current = io(SOCKET_SERVER_URL);

    // receive messages from server
    socketRef.current.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    // scroll to bottom on new message
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setConnectedName(name.trim());
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!connectedName) {
      alert("Enter your name first.");
      return;
    }
    if (!message.trim()) return;

    const payload = {
      name: connectedName,
      text: message.trim()
    };

    socketRef.current.emit("sendMessage", payload);
    setMessage("");
  };

  const formatTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString();
    } catch {
      return "";
    }
  };

  return (
    <div className="chat-box">
      <h2 className="title">Real-Time Chat</h2>

      <form onSubmit={handleJoin} className="name-form">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Set Name</button>
      </form>

      <div className="messages" ref={messagesRef}>
        {messages.map((m, idx) => (
          <div key={idx} className="message-line">
            <strong>{m.name} [{formatTime(m.timestamp)}]:</strong> {m.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="send-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>

      <div className="status">
        {connectedName ? <span>Connected as: {connectedName}</span> : <span>Not connected</span>}
      </div>
    </div>
  );
}
