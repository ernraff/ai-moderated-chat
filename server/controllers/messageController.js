const Message = require("../models/messageModel");
const moderator = require("../openai");

const sendMessage = async (msg, socket) => {
  try {
    // Moderate message before broadcasting
    const isFlagged = await moderator.moderateMessage(msg.content); // Await the async function

    if (isFlagged) {
      // If message is inappropriate, notify sender & refrain from sending
      socket.emit("flag_message", msg.user);
    } else {
      // If message is not flagged, save to MongoDB and broadcast it
      const newMessage = new Message({
        sender: msg.user.username,
        content: msg.content,
        type: "text",
      });
      await newMessage.save();
      socket.broadcast.emit("receive_message", msg);
    }
  } catch (error) {
    console.error("Error moderating message: ", error);
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.status(200).json({ messages: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to load messages" });
  }
};

module.exports = { sendMessage, getMessages };
