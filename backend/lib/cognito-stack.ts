import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as aws_iam from "aws-cdk-lib/aws-iam";

export class CognitoStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.userPool = new cognito.UserPool(this, "UserPool", {
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      signInCaseSensitive: false,
      signInAliases: { email: true },
      selfSignUpEnabled: true,
      autoVerify: { email: true },
      standardAttributes: {
        email: { required: true, mutable: true },
        fullname: { required: true, mutable: true },
      },
      customAttributes: {
        role: new cognito.StringAttribute({
          minLen: 5,
          maxLen: 10,
          mutable: true,
        }),
      },
    });

    new cognito.CfnUserPoolGroup(this, "AdminGroup", {
      userPoolId: this.userPool.userPoolId,
      groupName: "Admin",
      description: "Administrator group with full access",
      precedence: 0,
    });
    new cognito.CfnUserPoolGroup(this, "StandardGroup", {
      userPoolId: this.userPool.userPoolId,
      groupName: "Standard",
      description: "Standard user group with limited access",
      precedence: 1,
    });

    const postConfirmationLambda = new lambdaNodejs.NodejsFunction(
      this,
      "PostConfirmationFunction",
      {
        entry: "lambda/auth/assign-groups.ts",
        handler: "assignGroups",
        runtime: lambda.Runtime.NODEJS_24_X,
      },
    );
    postConfirmationLambda.addToRolePolicy(
      new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: ["cognito-idp:AdminAddUserToGroup"],
        resources: ["*"],
      }),
    );

    this.userPool.addTrigger(
      cognito.UserPoolOperation.POST_CONFIRMATION,
      postConfirmationLambda,
    );

    this.userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool: this.userPool,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    });

    new cdk.CfnOutput(this, "UserPoolId", {
      value: this.userPool.userPoolId,
    });
    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: this.userPoolClient.userPoolClientId,
    });
  }
}
