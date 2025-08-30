const User = require("../model/user");
const bcrypt = require("bcryptjs");

// Register a new user
const addUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ fullName, email, password: hashedPassword });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Login user and set cookie
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,      // use true if HTTPS
        sameSite: "lax",
        path: "/",
      })
      .status(200)
      .json({ message: "Login successful" });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

// Logout user and clear cookie
const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });
  res.json({ message: "Logged out successfully" });
};

module.exports = { addUser, loginUser, logoutUser };
