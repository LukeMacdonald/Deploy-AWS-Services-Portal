const { User } = require("../associations");

const findByUsername = async (username) => {
  try {
    // Query the database for the user by username
    const user = await User.findOne({ where: { username } });

    // Return the user if found, or null if not found
    return user;
  } catch (error) {
    console.error("Error finding user by username:", error);
    throw new Error("Database query failed");
  }
};

module.exports = {
  findByUsername,
};
