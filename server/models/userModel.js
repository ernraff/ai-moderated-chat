const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom" }], // Tracks joined chat rooms
});

const User = mongoose.model("User", userSchema);
module.exports = User;
