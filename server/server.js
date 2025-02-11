const db = require("./mongoDB/connection");
const Message = require("./models/messageModel"); // Import the Message model
const User = require("./models/userModel");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const messageController = require("./controllers/messageController");

const moderator = require("./openai");

const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

app.use(express.json());

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

// const clearMessages = async () => {
//   try {
//     await Message.deleteMany({}); // Deletes all documents in the messages collection
//     console.log("All messages cleared from the database.");
//   } catch (error) {
//     console.error("Error deleting messages:", error);
//   }
// };

const clearUsers = async () => {
  try {
    await User.deleteMany({}); // Deletes all documents in the messages collection
    console.log("All users cleared from the database.");
  } catch (error) {
    console.error("Error deleting messages:", error);
  }
};

clearUsers();

// clearMessages(); //ensure no messages remain from last chat session

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket) => {
  socket.on("send_message", async (msg) => {
    messageController.sendMessage(msg, socket, io);
  });

  socket.on("user_typing", (data) => {
    socket.broadcast.emit("user_typing", data);
  });

  socket.on("new_user", async (data) => {
    socket.broadcast.emit("new_user", data); //alert other users that new user has joined the chat
    socket.emit("load_messages", data); //load previous messages for new user
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
