const express = require("express");
const cookieParser = require("cookie-parser");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = YAML.load("./swagger.yaml");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const sync = require("./database/sync");
const authenticateToken = require("./middleware/jwt.js");

const PORT = process.env.PORT || 3005;

if (!process.env.PORT) {
  throw new Error("PORT environment variable is required");
}

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

// Cloud provider routes
app.use("/aws", require("./routes/aws.js"));
app.use("/azure", require("./routes/azure.js"));

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
    console.error("Failed to sync database:", error);
    process.exit(1); // Exit process with failure
  }
})();
