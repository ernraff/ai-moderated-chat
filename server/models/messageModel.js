const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String, //socket id of user who sent message
  content: String, //messagte content
  type: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
