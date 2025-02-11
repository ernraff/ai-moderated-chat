const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// Route to fetch all messages
router.get("/", messageController.getMessages);

module.exports = router;
