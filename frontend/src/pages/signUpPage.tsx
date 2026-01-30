import { useState, type JSX, type SubmitEvent, type ChangeEvent } from "react";
import { signUp, signIn } from "aws-amplify/auth";
import { Link, useNavigate, type NavigateFunction } from "react-router-dom";

export default function SignUpPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordMatch, setPasswordMatch] = useState<boolean>(false);

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
      });

      await signIn({ username: email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error signing up");
    } finally {
      setIsLoading(false);
    }
  }

  function handleConfirmPassword(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === password) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  }

  return (
    <div>
      <h1>Let's create you an account</h1>
      {error && <p>Error:{error}</p>}
      <form onSubmit={handleSignUp}>
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
