const sequelize = require("./config"); // Import the Sequelize instance
const User = require("./models/user");
const sync = async () => {
  try {
    // Authenticate the connection
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Sync the database schema
    await sequelize.sync({ force: true }); // Use { alter: true } if you want to update tables without dropping
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Error syncing with the database:", error);
    process.exit(1); // Exit with error code if syncing fails
  }
};

module.exports = sync;
