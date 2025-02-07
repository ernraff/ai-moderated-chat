const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String, //username of user who sent message
  content: String, //message
  type: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
