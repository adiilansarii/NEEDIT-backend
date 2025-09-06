const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load variables from .env

const secretKey = process.env.JWT_SECRET; // Secret key from .env

// Generate JWT for a user
function generateToken(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, secretKey, { expiresIn: "1d" });
}

// Validate JWT and return payload
function validateToken(token) {
  return jwt.verify(token, secretKey); // throws error if invalid
}

module.exports = { generateToken, validateToken };
