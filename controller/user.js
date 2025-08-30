const User = require("../model/user");
const bcrypt = require("bcryptjs");

const addUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // 6. Send success response
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

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
        secure: false, // false for HTTP localhost
        sameSite: "lax", // lax works without HTTPS
        path: "/",
      })
      .status(200)
      .json({ message: "Login successful" });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // false for HTTP localhost
    sameSite: "lax", // lax works without HTTPS
    path: "/",
  });
  res.json({ message: "Logged out successfully" });
};

module.exports = { addUser, loginUser, logoutUser };
