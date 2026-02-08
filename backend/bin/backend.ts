#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { CognitoStack } from "../lib/cognito-stack";
import { ApiStack } from "../lib/api-stack";
import { RdsStack } from "../lib/rds-stack";
import { S3Stack } from "../lib/s3-stack";

const app: cdk.App = new cdk.App();

new CognitoStack(app, "CognitoStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
const rdsStack: RdsStack = new RdsStack(app, "RdsStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
const s3Stack: S3Stack = new S3Stack(app, "S3Stack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
const apiStack: ApiStack = new ApiStack(app, "ApiStack", {
  rdsStack,
  s3Stack,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

apiStack.addDependency(rdsStack);
