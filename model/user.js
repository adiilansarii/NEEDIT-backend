const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../service/authentication"); // JWT helper

// User Schema
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    branch: { type: String, default: "B-Tech" }, // default branch
    profileImage: { type: String, default: "/dp.jpeg" }, // default profile image
  },
  { timestamps: true }
);

// Static method for login: validate password & return JWT
userSchema.statics.matchPasswordAndGenerateToken = async function (
  email,
  password
) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Incorrect password");
  return generateToken(user); // generate JWT
};

module.exports = mongoose.model("User", userSchema);
