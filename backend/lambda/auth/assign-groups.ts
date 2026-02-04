import { PostConfirmationTriggerEvent } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";

const cognito = new CognitoIdentityServiceProvider();

export async function assignGroups(
  event: PostConfirmationTriggerEvent,
): Promise<PostConfirmationTriggerEvent> {
  const { userPoolId, userName, request } = event;
  const userRole = request.userAttributes["custom:role"];

  try {
    const groupName = userRole === "admin" ? "Admin" : "Standard";

    await cognito
      .adminAddUserToGroup({
        UserPoolId: userPoolId,
        Username: userName,
        GroupName: groupName,
      })
      .promise();
    return event;
  } catch (error) {
    console.error("Error adding user to group:", error);
    throw error;
  }
}
