const ChatRoom = require("../models/chatModel");
const User = require("../models/userModel");

// Create a new chat room
const createChatRoom = async (req, res) => {
  const { name } = req.body;

  try {
    // Check if room already exists
    const existingRoom = await ChatRoom.findOne({ name });
    if (existingRoom)
      return res.status(400).json({ error: "Chat room already exists" });

    // Create new chat room
    const chatRoom = new ChatRoom({ name });
    await chatRoom.save();

    res.status(201).json({ message: "Chat room created", chatRoom });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all chat rooms
const getAllChatRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find().select("name members");
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Join a chat room
const joinChatRoom = async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user.id; // Ensure user is authenticated

  try {
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom)
      return res.status(404).json({ error: "Chat room not found" });

    if (!chatRoom.members.includes(userId)) {
      chatRoom.members.push(userId);
      await chatRoom.save();
    }

    res.status(200).json({ message: "Joined chat room", chatRoom });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createChatRoom, getAllChatRooms, joinChatRoom };
