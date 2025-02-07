const bcrypt = require("bcrypt");
const User = require("../models/userModel"); //import user model

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { username: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving users" });
  }
};

// Register a new user
const registerUser = async (req, res) => {
  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log("Hashed password:", hashedPassword);

    // Create and save user in MongoDB
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/// User login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Cannot find user" });
    }

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getUsers, registerUser, loginUser };
