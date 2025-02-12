const Message = require("../models/messageModel");
const moderator = require("../openai");

const sendMessage = async (msg, socket) => {
  try {
    // Ensure the message has a roomId
    if (!msg.roomId) {
      return console.error("Message missing roomId:", msg);
    }

    // Moderate message before broadcasting
    const isFlagged = await moderator.moderateMessage(msg.content);

    if (isFlagged) {
      socket.emit("flag_message", msg.user);
    } else {
      // Save the message to the database
      const newMessage = new Message({
        sender: msg.user.username,
        content: msg.content,
        type: "text",
        roomId: msg.roomId, // Ensure message is linked to a room
      });

      await newMessage.save();

      // Broadcast message only to users in the same chat room
      socket.to(msg.roomId).emit("receive_message", msg);
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({ error: "roomId is required" });
    }

    const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to load messages" });
  }
};

module.exports = { sendMessage, getMessages };
