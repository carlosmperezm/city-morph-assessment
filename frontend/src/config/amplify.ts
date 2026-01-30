import { Amplify } from "aws-amplify";

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_CLIENT_ID,
      region: import.meta.env.VITE_AWS_REGION,
    },
  },
  API: {
    REST: {
      cityMorphAPI: {
        endpoint: import.meta.env.VITE_API_ENDPOINT,
        region: import.meta.env.VITE_AWS_REGION,
      },
    },
  },
};

export function setUpAmplify() {
  return Amplify.configure(amplifyConfig);
}
