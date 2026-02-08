import { PostConfirmationTriggerEvent } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import type { Role } from "../shared/types";
import { isValidRole } from "../shared/validators";

const cognito = new CognitoIdentityServiceProvider();

export async function assignGroups(
  event: PostConfirmationTriggerEvent,
): Promise<PostConfirmationTriggerEvent> {
  const { userPoolId, userName, request } = event;
  const roleAttribute: string | undefined =
    request.userAttributes["custom:role"];

  if (!isValidRole(roleAttribute)) {
    throw new Error(`Invalid role: ${roleAttribute}`);
  }

  const userRole: Role = roleAttribute;

  try {
    const groupName: string = userRole === "admin" ? "Admin" : "Standard";

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
