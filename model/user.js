const mongoose = require("mongoose");
const { generateToken } = require("../service/authentication");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    branch: { type: String, default: "B-Tech" }, // New field
    profileImage: { type: String, default: "/dp.jpeg" },
  },
  { timestamps: true }
);

userSchema.statics.matchPasswordAndGenerateToken = async function (
  email,
  password
) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Password not matched");

  const token = generateToken(user);
  return token;
};

module.exports = mongoose.model("User", userSchema);
