// src/features/home/HomePage.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { performLogout } from "../features/auth/actions";

const HomePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(performLogout());
  };

  return (
    <div>
      <h1>Home Page</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.username}</h2>
          <p>Role: {user.role}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  );
};

export default HomePage;
