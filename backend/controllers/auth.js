const bcrypt = require("bcrypt"); // For password hashing and comparison
const jwt = require("jsonwebtoken"); // For generating JSON Web Tokens
const User = require("../database/models/user");

const authenticate = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use `secure` in production to ensure cookies are sent over HTTPS
      sameSite: "Strict", // Controls how cookies are sent with cross-site requests
      maxAge: 3600000, // Cookie expiry time (1 hour)
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const register = async (req, res) => {
  try {
    const { username, password, accessKey, keyId } = req.body;

    // Create the user
    const user = await User.create({
      username,
      password,
      accessKey,
      keyId,
    });

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use `secure` in production to ensure cookies are sent over HTTPS
      sameSite: "Strict", // Controls how cookies are sent with cross-site requests
      maxAge: 3600000, // Cookie expiry time (1 hour)
    });

    // Respond with user data and token
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  authenticate,
  register,
};
