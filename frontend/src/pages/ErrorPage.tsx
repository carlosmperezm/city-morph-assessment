import type { JSX } from "react";
import { Link, useRouteError } from "react-router-dom";
import { isError } from "../types/typeGuards";

export function ErrorPage(): JSX.Element {
  const routeError: unknown = useRouteError();

  const errorMessage: string = isError(routeError)
    ? routeError.message
    : String(routeError);

  return (
    <div>
      <h1>An error has occurred</h1>
      <p>Message: {errorMessage}</p>
      <Link to={"/"}> Go back to dashboard</Link>
      <Link to={"/login"}>Go back to the login page</Link>
      <Link to={"/signup"}>Go back to the signup page</Link>
    </div>
  );
}
