const { AWS_Account } = require("../../database/associations");
const create = async (req, res) => {
  const { accessKey, keyId } = req.body;

  try {
    // Create AWS account associated with the user
    const awsAccount = await AWS_Account.create({
      accessKey: accessKey,
      keyId: keyId,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "User and associated accounts created successfully!",
      awsAccount,
    });
  } catch (error) {
    console.error("Error creating user aws account credentials", error);
    res
      .status(500)
      .json({
        message: "Error creating user with aws account credentials",
        error: error.message,
      });
  }
};
module.exports = { create };
