const express = require("express");
const {
  createChatRoom,
  getAllChatRooms,
  joinChatRoom,
} = require("../controllers/chatController");
const verifyToken = require("../middleware/authMiddleware"); // Ensure JWT authentication is applied

const router = express.Router();

router.post("/", verifyToken, createChatRoom); // Create a chat room
router.get("/rooms", verifyToken, getAllChatRooms); // Get all chat rooms
router.post("/rooms/:roomId/join", verifyToken, joinChatRoom); // Join a chat room

module.exports = router;
