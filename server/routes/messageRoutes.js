const express = require("express");
const router = express.Router();
const { getMessages } = require("../controllers/messageController");
const verifyToken = require("../middleware/authMiddleware");

// Route to fetch all messages
router.get("/", verifyToken, getMessages);

module.exports = router;
