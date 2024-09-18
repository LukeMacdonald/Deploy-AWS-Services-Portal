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
    const subnetAttributesPromises = subnets.map((subnet) =>
      ec2.describeSubnets({ SubnetIds: [subnet.SubnetId] }).promise()
    );
    const subnetAttributes = await Promise.all(subnetAttributesPromises);

    // Map subnets to their respective VPCs and group by public/private
    const vpcsWithSubnets = vpcs.map((vpc) => {
      const vpcSubnets = subnets.filter((subnet) => subnet.VpcId === vpc.VpcId);
      const publicSubnets = [];
      const privateSubnets = [];

      vpcSubnets.forEach((subnet) => {
        const attributes = subnetAttributes.find(
          (attr) => attr.Subnets[0].SubnetId === subnet.SubnetId
        );
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
    console.error("Error fetching VPCs and subnets:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch VPCs and subnets",
        error: error.message,
      });
  }
};

const list_security_groups = async (req, res) => {
  try {
    const ec2 = new req.aws.EC2();
    const data = await ec2.describeSecurityGroups().promise();
    res.status(200).json(data.SecurityGroups);
  } catch (error) {
    console.error("Error listing security groups:", error);
    res
      .status(500)
      .json({
        message: "Failed to list security groups",
        error: error.message,
      });
  }
};

const create_security_group = async (req, res) => {
  const { groupName, description, vpcId } = req.body;

  if (!groupName || !description || !vpcId) {
    return res.status(400).json({ error: "Missing required parameters" });
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
      message: "Security group created successfully",
      groupId: data.GroupId,
    });
  } catch (error) {
    console.error("Error creating security group:", error);
    res
      .status(500)
      .json({
        message: "Failed to create security group",
        error: error.message,
      });
  }
};

const create_ingress_rule = async (req, res) => {
  const { groupId, ipProtocol, fromPort, toPort, cidrIp } = req.body;

  if (!groupId || !ipProtocol || !fromPort || !toPort || !cidrIp) {
    return res.status(400).json({ error: "Missing required parameters" });
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
    res.status(200).json({ message: "Port availability added successfully" });
  } catch (error) {
    console.error("Error adding port availability:", error);
    res
      .status(500)
      .json({
        message: "Failed to add port availability",
        error: error.message,
      });
  }
};

const create_egress_rule = async (req, res) => {
  const { groupId, ipProtocol, fromPort, toPort, cidrIp } = req.body;

  if (!groupId || !ipProtocol || !fromPort || !toPort || !cidrIp) {
    return res.status(400).json({ error: "Missing required parameters" });
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
    res.status(201).json({ message: "Egress rule created successfully" });
  } catch (error) {
    console.error("Error creating egress rule:", error);
    res
      .status(500)
      .json({ message: "Failed to create egress rule", error: error.message });
  }
};

module.exports = {
    get_vpcs_and_subnets,
    list_security_groups,
    create_security_group,
    create_ingress_rule,
    create_egress_rule,
}