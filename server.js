const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // for dev only; tighten for production
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // When a client sends a message
  socket.on("sendMessage", (messageData) => {
    // Broadcast message to all clients (including sender)
    io.emit("receiveMessage", {
      ...messageData,
      timestamp: new Date().toISOString()
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Socket.io server running on http://localhost:${PORT}`);
});
