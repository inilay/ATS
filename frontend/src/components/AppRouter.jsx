import React, { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "../router";
import { AuthContext } from "../context";
import Login from "../pages/Login/Login";


function AppRouter() {
  const { user } = useContext(AuthContext);
  return user ? (
    <Routes>
      {privateRoutes.map((route) => (
        <Route
          path={route.path}
          element={route.element}
          exact={route.exact}
          key={route.path}
        />
      ))}
      <Route
        path="*"
        element={
          <main style={{ padding: "1rem" }}>
            <p>There's nothing here!</p>
          </main>
        }
      />
    </Routes>
  ) : (
    <Routes>
      {publicRoutes.map((route) => (
        <Route
          path={route.path}
          element={route.element}
          exact={route.exact}
          key={route.path}
        />
      ))}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default AppRouter;
