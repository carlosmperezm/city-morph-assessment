
# React-TypeScript Application

This React TypeScript application provides user authentication, dashboard visualization, and conditional rendering with role-based access control.

## Setup Instructions

```bash
cd frontend
npm install
npm run dev
```

> [!WARNING]
> Make sure you have all necessary environment variables before lunching the front end. Otherwise you might get an error

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Configuration

Create `.env.local` at the same level than `vite.config.ts` with your AWS Amplify configuration:

```env
VITE_AWS_REGION=your-region
VITE_AWS_USER_POOL_ID=your-pool-id
VITE_AWS_CLIENT_ID=your-client-id
VITE_AWS_IDENTITY_POOL_ID=your-identity-pool-id
```

## Features

- User authentication and sign-up via AWS Cognito
- Role-based rendering and access control
- Dashboard with data visualization
- Error handling and routing
- State management
- Responsive design with CSS modules
