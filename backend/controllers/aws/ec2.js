const create_key_pair = async (req, res) => {
  const keyName = req.body.keyName; // Ensure keyName is coming from the request body

  // Input validation
  if (!keyName) {
    return res.status(400).json({ message: "Key name is required" });
  }

  const params = {
    KeyName: keyName, // Use uppercase 'KeyName' to match AWS SDK
  };

  try {
    const ec2 = new req.aws.EC2();
    const data = await ec2.createKeyPair(params).promise();
    console.log("Key Pair Created:", data.KeyName);

    res.status(201).json({
      keyName: data.KeyName,
      message: "Key pair successfully created",
      privateKey: data.KeyMaterial, // Consider security implications of sending the private key
    });
  } catch (error) {
    console.error("Error creating key pair:", error);
    res
      .status(500)
      .json({ message: "Failed to create key pair", error: error.message });
  }
};

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

const create = async (req, res) => {
  try {
    const {
      amiId,
      instanceType,
      keyName,
      securityGroupIds,
      subnetId,
      region,
      awsAccessKeyId,
      awsSecretAccessKey,
    } = req.body;

    // Validate input
    if (
      !amiId ||
      !instanceType ||
      !region ||
      !awsAccessKeyId ||
      !awsSecretAccessKey
    ) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Log the request for debugging purposes
    console.log("Create Instance function called with parameters:", {
      amiId,
      instanceType,
      keyName,
      securityGroupIds,
      subnetId,
    });

    // Initialize the EC2 client with provided credentials
    const ec2 = new req.aws.EC2();

    // Launch a new EC2 instance
    const params = {
      ImageId: amiId,
      InstanceType: instanceType,
      KeyName: keyName,
      SecurityGroupIds: securityGroupIds,
      SubnetId: subnetId,
      MinCount: 1,
      MaxCount: 1,
    };

    const data = await ec2.runInstances(params).promise();

    // Log the successful launch
    console.log("Successfully requested creation of instance:", data.Instances);

    // Respond with the instance creation details
    res.status(201).json({
      message: "EC2 instance created successfully",
      instanceId: data.Instances[0].InstanceId,
    });
  } catch (error) {
    // Log the error and send a response to the client
    console.error("Error creating EC2 instance:", error);
    res.status(500).json({
      error: "Failed to create EC2 instance",
      details: error.message,
    });
  }
};

const get_vpcs_and_subnets = async (req, res) => {
  try {
    const ec2 = new req.aws.EC2();

    // Fetch VPCs
    const vpcsData = await ec2.describeVpcs().promise();
    const vpcs = vpcsData.Vpcs;

    // Fetch Subnets
    const subnetsData = await ec2.describeSubnets().promise();
    const subnets = subnetsData.Subnets;

    // Fetch Subnet Attributes to determine if they are public or private
    const subnetAttributesPromises = subnets.map(subnet => 
      ec2.describeSubnets({ SubnetIds: [subnet.SubnetId] }).promise()
    );
    const subnetAttributes = await Promise.all(subnetAttributesPromises);

    // Map subnets to their respective VPCs and group by public/private
    const vpcsWithSubnets = vpcs.map(vpc => {
      const vpcSubnets = subnets.filter(subnet => subnet.VpcId === vpc.VpcId);
      const publicSubnets = [];
      const privateSubnets = [];

      vpcSubnets.forEach(subnet => {
        const attributes = subnetAttributes.find(attr => attr.Subnets[0].SubnetId === subnet.SubnetId);
        if (attributes.Subnets[0].MapPublicIpOnLaunch) {
          publicSubnets.push(subnet);
        } else {
          privateSubnets.push(subnet);
        }
      });

      return {
        ...vpc,
        PublicSubnets: publicSubnets,
        PrivateSubnets: privateSubnets,
      };
    });

    res.status(200).json(vpcsWithSubnets);
  } catch (error) {
    console.error('Error fetching VPCs and subnets:', error);
    res.status(500).json({ message: 'Failed to fetch VPCs and subnets', error: error.message });
  }
};
const list_security_groups = async (req, res) => {
  try {
    const ec2 = new req.aws.EC2();
    const data = await ec2.describeSecurityGroups().promise();
    res.status(200).json(data.SecurityGroups);
  } catch (error) {
    console.error('Error listing security groups:', error);
    res.status(500).json({ message: 'Failed to list security groups', error: error.message });
  }
};

const create_security_group = async (req, res) => {
  const { groupName, description, vpcId } = req.body;

  if (!groupName || !description || !vpcId) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const params = {
    GroupName: groupName,
    Description: description,
    VpcId: vpcId,
  };

  try {
    const ec2 = new req.aws.EC2();
    const data = await ec2.createSecurityGroup(params).promise();
    res.status(201).json({
      message: 'Security group created successfully',
      groupId: data.GroupId,
    });
  } catch (error) {
    console.error('Error creating security group:', error);
    res.status(500).json({ message: 'Failed to create security group', error: error.message });
  }
};

const create_ingress_rule = async (req, res) => {
  const { groupId, ipProtocol, fromPort, toPort, cidrIp } = req.body;

  if (!groupId || !ipProtocol || !fromPort || !toPort || !cidrIp) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const params = {
    GroupId: groupId,
    IpPermissions: [
      {
        IpProtocol: ipProtocol,
        FromPort: fromPort,
        ToPort: toPort,
        IpRanges: [{ CidrIp: cidrIp }],
      },
    ],
  };

  try {
    const ec2 = new req.aws.EC2();
    await ec2.authorizeSecurityGroupIngress(params).promise();
    res.status(200).json({ message: 'Port availability added successfully' });
  } catch (error) {
    console.error('Error adding port availability:', error);
    res.status(500).json({ message: 'Failed to add port availability', error: error.message });
  }
};

const create_egress_rule = async (req, res) => {
  const { groupId, ipProtocol, fromPort, toPort, cidrIp } = req.body;

  if (!groupId || !ipProtocol || !fromPort || !toPort || !cidrIp) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const params = {
    GroupId: groupId,
    IpPermissions: [
      {
        IpProtocol: ipProtocol,
        FromPort: fromPort,
        ToPort: toPort,
        IpRanges: [{ CidrIp: cidrIp }],
      },
    ],
  };

  try {
    const ec2 = new req.aws.EC2();
    await ec2.authorizeSecurityGroupEgress(params).promise();
    res.status(201).json({ message: 'Egress rule created successfully' });
  } catch (error) {
    console.error('Error creating egress rule:', error);
    res.status(500).json({ message: 'Failed to create egress rule', error: error.message });
  }
};


module.exports = {
  list,
  stop,
  terminate,
  create,
  create_key_pair,
  get_vpcs_and_subnets,
  list_security_groups,
  create_security_group,
  create_ingress_rule,
  create_egress_rule
};
