const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String, //username of user who sent message
  content: String, //message
  type: String,
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  }, //link to specific chat room
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
