const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function moderateMessage(message) {
  try {
    const response = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: message,
    });

    // console.log(response);

    return response.results[0].flagged; // Returns `true` if inappropriate, `false` otherwise
  } catch (error) {
    console.error("Error in moderation API:", error);
    return false;
  }
}

module.exports = { moderateMessage };
