import type { NavbarProps } from "../../types";
import { useState, type JSX } from "react";
import { signOut } from "aws-amplify/auth";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import styles from "./styles.module.css";

export default function Navbar({ user, setUser }: NavbarProps): JSX.Element {
  const [extendNavbar, setExtendNavbar] = useState<boolean>(true);
  const navigate: NavigateFunction = useNavigate();

  const isUserAdmin: boolean = user["custom:role"] === "admin";
  const dynamicClasses: string = `${styles.userDetails} ${extendNavbar ? `${styles.show}` : `${styles.noShow}`}`;

  async function handleSignout(): Promise<void> {
    await signOut();
    await navigate("/login");
    setUser(null);
  }

  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.navbar}>
        <div>
          <h1>Welcome {user.name}</h1>
          <p>
            <strong>Role</strong>: {user["custom:role"]}
          </p>
          <span
            className={styles.dropdown}
            onClick={() => setExtendNavbar(!extendNavbar)}
          >
            {extendNavbar ? "↑" : "↓"}
          </span>
        </div>
        {isUserAdmin ? (
          <div className={dynamicClasses}>
            <p>
              <strong>Email</strong>: {user.email}
            </p>
            <p>
              <strong>Email verified</strong>: {user.email_verified}
            </p>
            <p>
              <strong>Account id</strong>: {user.sub}
            </p>
            <button onClick={handleSignout}>Sign Out</button>
          </div>
        ) : (
          <div className={dynamicClasses}>
            <p>
              <strong>Email</strong>: {user.email}
            </p>
            <button onClick={handleSignout}>Sign Out</button>
          </div>
        )}
      </nav>
      {!isUserAdmin && (
        <div className={styles.warning}>
          Data is limited due to user's permissions
        </div>
      )}
    </div>
  );
}
