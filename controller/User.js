const User = require("../model/user");
const bcrypt = require("bcryptjs");

// -------- SIGNUP --------
const addUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ fullName, email, password: hashedPassword });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------- LOGIN --------
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    // Cookie settings for Render backend + localhost frontend
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,      // required on HTTPS (Render)
        sameSite: "None",  // allows cross-origin from localhost
        path: "/",
      })
      .status(200)
       .json({ message: "Login successful", user: { _id: user._id, fullName: user.fullName } });
  } catch (err) {
    return res.status(401).json({ message: "yahi se aa rha hai error" });
  }
};

// -------- LOGOUT --------
const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
  res.json({ message: "Logged out successfully" });
};

module.exports = { addUser, loginUser, logoutUser };
