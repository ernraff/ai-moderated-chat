const express = require("express");
const router = express.Router();
const {
  getUsers,
  registerUser,
  loginUser,
} = require("../controllers/userController");

const verifyToken = require("../middleware/authMiddleware");

// Routes
router.get("/", verifyToken, getUsers);
router.post("/signup", registerUser);
router.post("/login", loginUser);

module.exports = router;
