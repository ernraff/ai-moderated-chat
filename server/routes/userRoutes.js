const express = require("express");
const router = express.Router();
const {
  getUsers,
  registerUser,
  loginUser,
} = require("../controllers/userController");

// Routes
router.get("/", getUsers);
router.post("/signup", registerUser);
router.post("/login", loginUser);

module.exports = router;
