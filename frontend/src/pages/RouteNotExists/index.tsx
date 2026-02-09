import type { JSX } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import type { RouteNotExistsProps } from "../../types";

export function RouteNotExistsPage({ user }: RouteNotExistsProps): JSX.Element {
  if (user) {
    return (
      <div className={styles.container}>
        <h1>This Route does not exist</h1>
        <h2>Here are some useful links in case you are lost</h2>
        <div className={styles.linksContainer}>
          <Link to={"/"}>Go to dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>This Route does not exist</h1>
      <h2>Here are some useful links in case you are lost</h2>
      <div className={styles.linksContainer}>
        <Link to={"/login"}>Log in</Link>
        <Link to={"/signup"}>Sign up</Link>
      </div>
    </div>
  );
}
