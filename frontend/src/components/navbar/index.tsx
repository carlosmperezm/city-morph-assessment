import type { NavbarProps } from "../../types";
import { type JSX } from "react";
import { signOut } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export default function Navbar({ user, setUser }: NavbarProps): JSX.Element {
  const navigate = useNavigate();

  async function handleSignout(): Promise<void> {
    await signOut();
    await navigate("/login");
    setUser(null);
  }

  return (
    <nav className={styles.navbar}>
      <div>
        <h1>Hi {user.name}</h1>
        <p>Role: {user["custom:role"]}</p>
      </div>
      <div className={styles.userDetails}>
        <p>Email: {user.email}</p>
        <p>Email verified: {user.email_verified}</p>
        <p>Account id: {user.sub}</p>
        <button onClick={handleSignout}>Sign Out</button>
      </div>
    </nav>
  );
}
