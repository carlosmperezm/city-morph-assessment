#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { BackendStack } from "../lib/backend-stack";
import { CognitoStack } from "../lib/cognito-stack";
import { ApiStack } from "../lib/api-stack";
import { RdsStack } from "../lib/rds-stack";
import { S3Stack } from "../lib/s3-stack";

const app = new cdk.App();

new BackendStack(app, "BackendStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
new CognitoStack(app, "CognitoStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
const rdsStack = new RdsStack(app, "RdsStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
const apiStack = new ApiStack(app, "ApiStack", {
  rdsStack,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

apiStack.addDependency(rdsStack);

new S3Stack(app, "S3Stack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
