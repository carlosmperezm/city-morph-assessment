import {
  fetchUserAttributes,
  signIn,
  confirmSignUp,
  resendSignUpCode,
  type UserAttributeKey,
} from "aws-amplify/auth";
import { type JSX, useState, type SubmitEvent } from "react";
import { Link, type NavigateFunction, useNavigate } from "react-router-dom";
import type { LoginPageProps } from "../../types";
import styles from "./styles.module.css";

export function LoginPage({ setUser }: LoginPageProps): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const navigate: NavigateFunction = useNavigate();
  const needsConfirmation: boolean = error.includes(
    "User needs to be authenticated",
  );

  async function handleLogIn(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setIsLoading(true);
    try {
      await signIn({ username: email, password });
      const currentUser: Partial<Record<UserAttributeKey, string>> =
        await fetchUserAttributes();
      setUser(currentUser);
      await navigate("/dashboard");
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  }
  async function handleConfirmSignUp(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setIsLoading(true);
    try {
      await confirmSignUp({
        username: email,
        confirmationCode,
      });
      await signIn({ username: email, password });
      const currentUser: Partial<Record<UserAttributeKey, string>> =
        await fetchUserAttributes();
      setUser(currentUser);
      navigate("/");
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  }
  if (needsConfirmation) {
    resendSignUpCode({ username: email });
    setError("Verification code resent!");
    setShowConfirmation(true);
  }

  if (showConfirmation) {
    return (
      <div className={styles.container}>
        <h1>Confirm your email</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form
          onSubmit={handleConfirmSignUp}
          className={styles.confirmationForm}
        >
          <input
            placeholder="Confirmation code"
            type="text"
            minLength={6}
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={isLoading || confirmationCode.length < 6}
          >
            {isLoading ? "Confirming..." : "Confirm"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>Error:{error}</p>}
      <form onSubmit={handleLogIn} className={styles.form}>
        <h1>Login</h1>
        <input
          placeholder="email"
          type="email"
          name="email"
          required
          onChange={(event) => setEmail(event.target.value)}
          value={email}
        />
        <input
          placeholder="password"
          type="password"
          name="password"
          minLength={5}
          onChange={(event) => setPassword(event.target.value)}
          value={password}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging In..." : "Log In"}
        </button>
      </form>
      <Link to="/signup">Don't have an account? Sign Up</Link>
    </div>
  );
}
