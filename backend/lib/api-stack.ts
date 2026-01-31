import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dashboardFn = new lambdaNodejs.NodejsFunction(
      this,
      "DashboardFunction",
      {
        entry: path.join(__dirname, "../lambda/dashboard/handler.ts"),
        handler: "handler",
        runtime: lambda.Runtime.NODEJS_20_X,
      },
    );

    const api = new apigateway.RestApi(this, "CityMorphApi", {
      restApiName: "city-morph-api",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ["GET", "OPTIONS"],
      },
    });

    const dashboard = api.root.addResource("data");
    dashboard.addMethod("GET", new apigateway.LambdaIntegration(dashboardFn));

    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url,
    });
  }
}
