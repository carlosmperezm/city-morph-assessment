import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";

export class RdsStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly dbInstance: rds.DatabaseInstance;
  public readonly dbSecurityGroup: ec2.SecurityGroup;
  public readonly lambdaSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, "AppVpc", {
      maxAzs: 2,
      natGateways: 1,
    });

    this.dbSecurityGroup = new ec2.SecurityGroup(this, "DbSecurityGroup", {
      vpc: this.vpc,
      description: "Allow DB access from Lambda SG",
      allowAllOutbound: true,
    });
    this.lambdaSecurityGroup = new ec2.SecurityGroup(
      this,
      "LambdaSecurityGroup",
      {
        vpc: this.vpc,
        description: "Lambda Security Group for RDS access",
        allowAllOutbound: true,
      },
    );

    this.dbInstance = new rds.DatabaseInstance(this, "PostgresInstance", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_17,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO,
      ),
      vpc: this.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [this.dbSecurityGroup],
      credentials: rds.Credentials.fromGeneratedSecret("dbadmin"),
      databaseName: "citymorph",
      publiclyAccessible: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deleteAutomatedBackups: true,
    });

    this.dbInstance.connections.allowDefaultPortFrom(this.lambdaSecurityGroup);

    new cdk.CfnOutput(this, "DbEndpoint", {
      value: this.dbInstance.dbInstanceEndpointAddress,
    });

    new cdk.CfnOutput(this, "DbSecretArn", {
      value: this.dbInstance.secret?.secretArn ?? "no-secret",
    });
  }
}
