import { fetchUserAttributes, signIn } from "aws-amplify/auth";
import { type JSX, useState, type SubmitEvent } from "react";
import { Link, type NavigateFunction, useNavigate } from "react-router-dom";
import type { LoginPageProps } from "../../types";
import styles from "./styles.module.css";

export function LoginPage({ setUser }: LoginPageProps): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate: NavigateFunction = useNavigate();

  async function handleLogIn(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setIsLoading(true);
    try {
      await signIn({ username: email, password });
      const currentUser = await fetchUserAttributes();
      setUser(currentUser);
      await navigate("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error to log in. Try again",
      );
    }
  }

  return (
    <div className={styles.container}>
      {error && <p>Error: {error}</p>}
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
