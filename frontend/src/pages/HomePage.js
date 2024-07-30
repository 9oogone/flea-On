// src/pages/HomePage.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { performLogout } from "../features/auth/actions";

const HomePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);



  const handleLogout = () => {
    dispatch(performLogout());
  };

  return (
    <div>
      <h1>Home Page</h1>
      {isAuthenticated ? (
        <div>
          <h2>Welcome, {user ? user.username : "User"}</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  );
};

export default HomePage;
