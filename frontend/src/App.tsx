import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getCurrentUser, type AuthUser } from "aws-amplify/auth";
import DashboardPage from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { RouteNotExistsPage } from "./pages/RouteNotExistsPage";
import { ErrorPage } from "./pages/ErrorPage";
import SignUpPage from "./pages/signUpPage";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    async function getUser() {
      try {
        const user: AuthUser = await getCurrentUser();
        console.log("User found: ", user);
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    }

    getUser();
  }, []);

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  console.log("isAuthenticated:", isAuthenticated);
  console.log("isLoading:", isLoading);

  return (
    <BrowserRouter>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route
              path="/"
              element={<DashboardPage />}
              errorElement={<ErrorPage />}
            />
            <Route
              path="/dashboard"
              element={<DashboardPage />}
              errorElement={<ErrorPage />}
            />
          </>
        ) : (
          <>
            <Route
              path="/"
              element={<LoginPage />}
              errorElement={<ErrorPage />}
            />
            <Route
              path="/login"
              element={<LoginPage />}
              errorElement={<ErrorPage />}
            />
            <Route
              path="/signup"
              element={<SignUpPage />}
              errorElement={<ErrorPage />}
            />
          </>
        )}
        <Route path="*" element={<RouteNotExistsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
