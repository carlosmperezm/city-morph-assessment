# CDK Backend Project

## Backend Setup

```bash
cd backend
npm install
npm run build
cdk synth
cdk deploy
```

## Quick Reference

- `npm run build` - Compile TypeScript
- `npm test` - Run tests
- `cdk deploy` - Deploy infrastructure

## Useful commands

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for changes and compile
- `npm run test` - Perform the Jest unit tests
- `npx cdk deploy` - Deploy this stack to your default AWS account/region
- `npx cdk diff` - Compare deployed stack with current state
- `npx cdk synth` - Emit the synthesized CloudFormation template

## Project Overview

This is an AWS CDK infrastructure-as-code project that provisions and manages cloud resources for the City Morph Assessment application. It handles authentication, data management, image storage, and API endpoints.

## Architecture

The backend is organized into several stacks:

- **Cognito Stack** - User authentication and authorization with group-based access control
- **RDS Stack** - PostgreSQL database for application data
- **S3 Stack** - Object storage for images and assets
- **API Stack** - REST API Gateway with Lambda functions
- **Lambda Functions** - Serverless compute for business logic

## Lambda Functions

- `assign-groups` - Manages user group assignments for role-based access
- `get-data` - Retrieves dashboard data for visualization
- `get-images` - Fetches images from S3 storage
- `seed` - Database initialization and sample data

## Getting Started

1. Install dependencies:

    ```bash
    npm install
    ```

2. Build the TypeScript code:

    ```bash
    npm run build
    ```

3. Synthesize the CloudFormation template:

    ```bash
    cdk synth
    ```

4. Deploy to AWS:

    ```bash
    cdk deploy
    ```

## Prerequisites

>[!WARNING]
> Ensure you have an AWS account and AWS CLI installed and configured.
> CDK commands like `cdk synth` and `cdk deploy` will not work without AWS CLI credentials.
