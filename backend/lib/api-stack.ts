import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { RdsStack } from "./rds-stack";
import { S3Stack } from "./s3-stack";

export interface ApiStackProps extends cdk.StackProps {
  rdsStack: RdsStack;
  s3Stack: S3Stack;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { rdsStack, s3Stack } = props;

    const dashboardFn = new lambdaNodejs.NodejsFunction(
      this,
      "DashboardFunction",
      {
        entry: "lambda/dashboard/get-data.ts",
        handler: "getData",
        runtime: lambda.Runtime.NODEJS_24_X,
        vpc: rdsStack.vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
        securityGroups: [rdsStack.lambdaSecurityGroup],
        environment: {
          DB_ENDPOINT: rdsStack.dbInstance.dbInstanceEndpointAddress,
          DB_SECRET_ARN: rdsStack.dbInstance.secret?.secretArn ?? "",
          DB_NAME: "citymorph",
        },
      },
    );
    const imagesFn = new lambdaNodejs.NodejsFunction(this, "ImagesFunction", {
      entry: "lambda/images/get-images.ts",
      handler: "getImages",
      runtime: lambda.Runtime.NODEJS_24_X,
      environment: {
        BUCKET_NAME: s3Stack.imageBucket.bucketName,
      },
    });

    rdsStack.dbInstance.secret?.grantRead(dashboardFn);
    s3Stack.imageBucket.grantRead(imagesFn);

    const api = new apigateway.RestApi(this, "CityMorphApi", {
      restApiName: "city-morph-api",
      defaultCorsPreflightOptions: {
        allowOrigins: [
          "http://localhost:5173",
          "https://city-morph-assessment.s3-website-us-west-1.amazonaws.com",
          "http://city-morph-assessment.s3-website-us-west-1.amazonaws.com",
        ],
        allowMethods: ["GET"],
        allowHeaders: [
          "Content-Type",
          "Authorization",
          "X-Amz-Date",
          "X-Api-Key",
          "X-Amz-Security-Token",
        ],
        allowCredentials: true,
      },
    });

    const dashboard = api.root.addResource("data");
    dashboard.addMethod("GET", new apigateway.LambdaIntegration(dashboardFn));
    const images = api.root.addResource("images");
    images.addMethod("GET", new apigateway.LambdaIntegration(imagesFn));

    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url,
    });
  }
}
