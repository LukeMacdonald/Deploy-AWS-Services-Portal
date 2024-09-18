const User = require("./models/user");
const AWS_Account = require("./models/aws");
const Azure_Account = require("./models/azure");

// One-to-One relationships
User.hasOne(AWS_Account, { foreignKey: "userId" });
AWS_Account.belongsTo(User, { foreignKey: "userId" });

User.hasOne(Azure_Account, { foreignKey: "userId" });
Azure_Account.belongsTo(User, { foreignKey: "userId" });

module.exports = { User, AWS_Account, Azure_Account };
