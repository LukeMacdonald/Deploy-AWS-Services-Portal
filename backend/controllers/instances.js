const list = async (req, res) => {
  try {
    // Log the request for debugging purposes
    console.log("Deploy function called");

    // Initialize the EC2 client from the AWS SDK
    const ec2 = new req.aws.EC2();
    // Describe EC2 instances to test connectivity
    const data = await ec2.describeInstances().promise();

    // Log the successful connection
    console.log(
      "Successfully connected to AWS EC2. Instances:",
      data.Reservations,
    );

    // Respond with the instance data
    res.status(200).json({
      message: "Successfully connected to AWS EC2",
      instances: data.Reservations,
    });
  } catch (error) {
    // Log the error and send a response to the client
    console.error("Error connecting to AWS EC2:", error);
    res.status(500).json({
      error: "Failed to connect to AWS EC2",
      details: error.message,
    });
  }
};

module.exports = {
  list,
};
