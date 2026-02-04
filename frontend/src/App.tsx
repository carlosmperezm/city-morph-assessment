import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { fetchUserAttributes, type UserAttributeKey } from "aws-amplify/auth";
import DashboardPage from "./pages/dashboard/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { RouteNotExistsPage } from "./pages/RouteNotExistsPage";
import { ErrorPage } from "./pages/ErrorPage";
import SignUpPage from "./pages/signUpPage";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<Partial<
    Record<UserAttributeKey, string>
  > | null>(null);

  useEffect(() => {
    async function getUser() {
      try {
        const currentUser = await fetchUserAttributes();
        setUser(currentUser);
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

  return (
    <BrowserRouter>
      <Routes>
        {user ? (
          <>
            <Route
              path="/"
              element={<DashboardPage user={user} setUser={setUser} />}
              errorElement={<ErrorPage />}
            />
            <Route
              path="/dashboard"
              element={<DashboardPage user={user} setUser={setUser} />}
              errorElement={<ErrorPage />}
            />
          </>
        ) : (
          <>
            <Route
              path="/"
              element={<LoginPage setUser={setUser} />}
              errorElement={<ErrorPage />}
            />
            <Route
              path="/login"
              element={<LoginPage setUser={setUser} />}
              errorElement={<ErrorPage />}
            />
            <Route
              path="/signup"
              element={<SignUpPage setUser={setUser} />}
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
