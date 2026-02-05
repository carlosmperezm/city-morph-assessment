# City Morph Assessment

A full-stack application with React frontend and AWS CDK backend infrastructure.

## Project Overview

This is a full stack developer Technical assessment with, dashboard data visualization, and product management capabilities. The project uses modern cloud infrastructure on AWS with TypeScript throughout.

## Tech Stack

**Frontend:**

- React 18+ with TypeScript
- Vite build tool
- AWS Amplify for authentication
- ESLint for code quality

**Backend:**

- AWS CDK for infrastructure as code
- AWS Lambda functions
- Amazon RDS for database
- Amazon S3 for image storage
- Amazon Cognito for authentication
- API Gateway for REST API hosting

## Project Structure

```directory
├── frontend/           # React TypeScript application
├── backend/            # AWS CDK infrastructure
└── .github/workflows/  # CI/CD pipeline configurations
```

## Setup Instructions

There is a readme file inside each project directory with specific setup instructions.

### Prerequisites

- Node.js 18+
- AWS Account and CLI configured
- TypeScript knowledge

## Features

- User authentication and sign-up
- User groups control
- Dashboard with data visualization
- Based-role rendering
- Error handling and routing
- Responsive UI design

## CI/CD

Automated workflows for frontend and backend deployment are configured in `.github/workflows/`.
