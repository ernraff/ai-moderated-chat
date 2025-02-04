const moderator = require("./openai");

const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("send_message", async (msg) => {
    try {
      // Moderate message before broadcasting
      const isFlagged = await moderator.moderateMessage(msg.content); // Await the async function

      if (isFlagged) {
        // If message is inappropriate, notify sender & refrain from sending
        socket.emit("flag_message", msg.user);
      } else {
        // If message is not flagged, broadcast it
        socket.broadcast.emit("receive_message", msg);
      }
    } catch (error) {
      console.error("Error moderating message:", error);
    }
  });

  socket.on("user_typing", (data) => {
    socket.broadcast.emit("user_typing", data);
  });

  socket.on("new_user", (data) => {
    socket.broadcast.emit("new_user", data.user);
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
