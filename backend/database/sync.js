const sequelize = require("./config"); // Import the Sequelize instance

const { User, AWS_Account, Azure_Account } = require("./associations"); // Import the models and associations
const sync = async () => {
  try {
    // Authenticate the connection
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Sync the database schema
    await sequelize.sync({ alter: true });
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Error syncing with the database:", error);
    process.exit(1); // Exit with error code if syncing fails
  }
};

module.exports = sync;
