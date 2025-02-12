const db = require("./mongoDB/connection");
const Message = require("./models/messageModel"); // Import the Message model
const User = require("./models/userModel");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const messageController = require("./controllers/messageController");
const chatRoutes = require("./routes/chatRoutes");

const moderator = require("./openai");

const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

app.use(express.json());

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend origin
    methods: ["GET", "POST"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//routes
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);
app.use("/chats", chatRoutes);

// const clearMessages = async () => {
//   try {
//     await Message.deleteMany({}); // Deletes all documents in the messages collection
//     console.log("All messages cleared from the database.");
//   } catch (error) {
//     console.error("Error deleting messages:", error);
//   }
// };

// const clearUsers = async () => {
//   try {
//     await User.deleteMany({}); // Deletes all documents in the messages collection
//     console.log("All users cleared from the database.");
//   } catch (error) {
//     console.error("Error deleting messages:", error);
//   }
// };

// clearUsers();

// clearMessages(); //ensure no messages remain from last chat session

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // User joins a room
  socket.on("join_room", async ({ roomId, user }) => {
    console.log(`${user.username} is attempting to join room: ${roomId}`);

    socket.join(roomId);
    console.log(`${user.username} has joined room: ${roomId}`);

    // Load previous messages for this chat room
    try {
      const messages = await messageController.getMessagesForRoom(roomId);
      console.log(
        `Sending ${messages.length} previous messages to ${user.username} in room: ${roomId}`
      );
      socket.emit("load_messages", { roomId, messages });
    } catch (error) {
      console.error(`Error loading messages for room ${roomId}:`, error);
    }

    // Notify others in the room
    socket.to(roomId).emit("new_user", { username: user.username });
  });

  // Sending a message within a specific room
  socket.on("send_message", async ({ roomId, msg }) => {
    console.log(
      `${msg.senderId} is sending a message to room ${roomId}: "${msg.content}"`
    );

    try {
      const savedMessage = await messageController.sendMessage(msg, roomId);
      console.log(`Message saved and broadcasting to room ${roomId}`);
      io.to(roomId).emit("receive_message", savedMessage);
    } catch (error) {
      console.error(`Error saving message for room ${roomId}:`, error);
    }
  });

  // User typing indicator (room-specific)
  socket.on("user_typing", ({ roomId, user }) => {
    console.log(`${user.username} is typing in room ${roomId}`);
    socket.to(roomId).emit("user_typing", { username: user.username });
  });

  // User disconnecting
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
