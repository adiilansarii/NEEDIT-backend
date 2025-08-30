// In your login controller (User.js)
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    // Cookies for deployed backend
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,       // HTTPS required for Render
        sameSite: "None",   // allow cross-origin from localhost frontend
        path: "/",
      })
      .status(200)
      .json({ message: "Login successful" });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

// Logout
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