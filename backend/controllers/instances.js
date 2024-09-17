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

const stop = async (req, res) => {
  try {
    const { instanceIds } = req.body; // Expecting instance IDs in the request body

    if (!instanceIds || !Array.isArray(instanceIds)) {
      return res.status(400).json({ error: "Invalid instance IDs provided" });
    }

    console.log("Stop function called with instance IDs:", instanceIds);

    // Initialize the EC2 client from the AWS SDK
    const ec2 = new req.aws.EC2();
    // Stop EC2 instances
    const data = await ec2
      .stopInstances({ InstanceIds: instanceIds })
      .promise();

    // Log the successful stop operation
    console.log(
      "Successfully requested stop for instances:",
      data.StoppingInstances,
    );

    // Respond with the status of the stop operation
    res.status(200).json({
      message: "Stop request successful",
      stoppingInstances: data.StoppingInstances,
    });
  } catch (error) {
    // Log the error and send a response to the client
    console.error("Error stopping EC2 instances:", error);
    res.status(500).json({
      error: "Failed to stop EC2 instances",
      details: error.message,
    });
  }
};

const terminate = async (req, res) => {
  try {
    const { instanceIds } = req.body; // Expecting instance IDs in the request body

    if (!instanceIds || !Array.isArray(instanceIds)) {
      return res.status(400).json({ error: "Invalid instance IDs provided" });
    }

    console.log("Terminate function called with instance IDs:", instanceIds);

    // Initialize the EC2 client from the AWS SDK
    const ec2 = new req.aws.EC2();
    // Terminate EC2 instances
    const data = await ec2
      .terminateInstances({ InstanceIds: instanceIds })
      .promise();

    // Log the successful termination operation
    console.log(
      "Successfully requested termination for instances:",
      data.TerminatingInstances,
    );

    // Respond with the status of the termination operation
    res.status(200).json({
      message: "Terminate request successful",
      terminatingInstances: data.TerminatingInstances,
    });
  } catch (error) {
    // Log the error and send a response to the client
    console.error("Error terminating EC2 instances:", error);
    res.status(500).json({
      error: "Failed to terminate EC2 instances",
      details: error.message,
    });
  }
};

module.exports = {
  list,
  stop,
  terminate,
};
