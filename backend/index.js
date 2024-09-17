const express = require("express");
const cookieParser = require("cookie-parser"); // For parsing cookies
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = YAML.load("./swagger.yaml");
const morgan = require("morgan"); // For HTTP request logging

require("dotenv").config();

const sync = require("./database/sync");
const authenticateToken = require("./middleware/jwt.js");
const attachAWS = require("./config/aws.js");

const PORT = process.env.PORT || 3005;

const app = express();

// Middleware
app.use(morgan("combined")); // HTTP request logging
app.use(cookieParser()); // Cookie parsing
app.use(express.json()); // JSON parsing

// Swagger documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Auth routes
app.use("/auth", require("./routes/auth.js"));

// Protected routes should be after authentication middleware
app.use(authenticateToken);
app.use(attachAWS);
// EC2 routes
app.use("/ec2", require("./routes/instances.js"));

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Sync database and start server
(async () => {
  try {
    await sync(); // Sync the database and models
    app.listen(PORT, () => {
      console.log(`App running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
})();
