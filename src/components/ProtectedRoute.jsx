import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Check for a token in localStorage
  const token = localStorage.getItem("token");

  // If no token exists, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the protected routes
  return <Outlet />;
};

export default ProtectedRoute;
