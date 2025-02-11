require("dotenv").config(); // Load environment variables
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET; // Read from .env

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ error: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.user = decoded; // Attach user data to request
    next(); // Continue to the next middleware or controller
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = verifyToken;
