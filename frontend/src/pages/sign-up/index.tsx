import { useState, type JSX, type SubmitEvent, type ChangeEvent } from "react";
import {
  signUp,
  signIn,
  confirmSignUp,
  fetchUserAttributes,
} from "aws-amplify/auth";
import { Link, useNavigate, type NavigateFunction } from "react-router-dom";
import type { Role, SignUpPageProps } from "../../types";
import styles from "./styles.module.css";

export default function SignUpPage({ setUser }: SignUpPageProps): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<Role>("standard");
  const [passwordMatch, setPasswordMatch] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate: NavigateFunction = useNavigate();

  async function handleSignUp(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setIsLoading(true);
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: { email, name, "custom:role": role },
        },
      });
      setShowConfirmation(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error signing up");
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
      const currentUser = await fetchUserAttributes();
      setUser(currentUser);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error confirming signup");
    } finally {
      setIsLoading(false);
    }
  }

  function handleConfirmPassword(event: ChangeEvent<HTMLInputElement>): void {
    setPasswordMatch(event.target.value === password);
  }

  if (showConfirmation) {
    return (
      <div className={styles.container}>
        <h1>Confirm your email</h1>
        {error && <p className={styles.error}>Error:{error}</p>}
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
      <h1>Let's create you an account</h1>
      {error && <p className={styles.error}>Error:{error}</p>}
      <form onSubmit={handleSignUp} className={styles.form}>
        <input
          placeholder="Your Name"
          type="text"
          name="name"
          required
          onChange={(event) => setName(event.target.value)}
        />
        <input
          placeholder="email"
          type="email"
          name="email"
          required
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          name="password"
          minLength={5}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <input
          className={passwordMatch ? "valid" : "invalid"}
          placeholder="confirm password"
          type="password"
          name="confirmPassword"
          onChange={handleConfirmPassword}
          required
        />
        <fieldset>
          <legend>Select type of user:</legend>
          <label>
            <input
              type="radio"
              id="standard"
              name="user-role"
              value="standard"
              checked={role === "standard"}
              onChange={(e) => setRole(e.target.value as Role)}
            />
            Standard
          </label>

          <label>
            <input
              type="radio"
              id="admin"
              name="user-role"
              value="admin"
              checked={role === "admin"}
              onChange={(e) => setRole(e.target.value as Role)}
            />
            Admin
          </label>
        </fieldset>

        <button type="submit" disabled={isLoading || !passwordMatch}>
          {isLoading
            ? "Signing up..."
            : !passwordMatch
              ? "Passwords do not match"
              : "Sign Up"}
        </button>
      </form>
      <Link to={"/login"}>Already have an account?</Link>
    </div>
  );
}
