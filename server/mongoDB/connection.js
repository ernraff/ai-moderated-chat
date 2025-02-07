const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//establish connection to MongoDB
const mongoDBConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("MongoDB - Connected");
  } catch (error) {
    console.log("Error - MongoDB Connection " + error);
  }
};

//auto-execute when file is imported
mongoDBConnect();

module.exports = { mongoDBConnect };
