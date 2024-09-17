const jwt = require("jsonwebtoken");
const { findByUsername } = require("../database/queries/users.js");

const authenticateToken = async (req, res, next) => {
  // Extract token from cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Token required" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by username
    const user = await findByUsername(decoded.username);

    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = authenticateToken;
