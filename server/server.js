const db = require("./mongoDB/connection"); // Import MongoDB connection
const Message = require("./models/messageModel"); // Import the Message model
const User = require("./models/userModel");
const userRoutes = require("./routes/userRoutes");

const moderator = require("./openai");

const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use("/users", userRoutes);

const clearMessages = async () => {
  try {
    await Message.deleteMany({}); // Deletes all documents in the messages collection
    console.log("All messages cleared from the database.");
  } catch (error) {
    console.error("Error deleting messages:", error);
  }
};

const clearUsers = async () => {
  try {
    await User.deleteMany({}); // Deletes all documents in the messages collection
    console.log("All users cleared from the database.");
  } catch (error) {
    console.error("Error deleting messages:", error);
  }
};

// clearUsers();

clearMessages(); //ensure no messages remain from last chat session

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket) => {
  socket.on("send_message", async (msg) => {
    try {
      // Moderate message before broadcasting
      const isFlagged = await moderator.moderateMessage(msg.content); // Await the async function

      if (isFlagged) {
        // If message is inappropriate, notify sender & refrain from sending
        socket.emit("flag_message", msg.user);
      } else {
        // If message is not flagged, save to MongoDB and broadcast it
        const newMessage = new Message({
          sender: msg.user.id,
          content: msg.content,
          type: "text",
        });
        await newMessage.save();
        socket.broadcast.emit("receive_message", msg);
      }
    } catch (error) {
      console.error("Error moderating message: ", error);
    }
  });

  socket.on("user_typing", (data) => {
    socket.broadcast.emit("user_typing", data);
  });

  socket.on("new_user", async (data) => {
    socket.broadcast.emit("new_user", data);
    // console.log(`User connected: ${data.id}`);
    // load past messages from MongoDB and send them to the connected user
    try {
      const messages = await Message.find().sort({ timestamp: 1 }); // sort messages from oldest to youngest
      console.log("Messages: ", messages);
      // console.log("User: ", data.name);
      socket.emit("load_messages", data, messages); // Send messages to the newly connected user
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
