// src/App.js
import React, { useEffect } from "react";

import { useDispatch } from "react-redux";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LoginSuccess from "./features/auth/components/LoginSuccess";
import PrivateRoute from "./components/PrivateRoute";
import { checkLoginStatus } from "./features/auth/actions";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
