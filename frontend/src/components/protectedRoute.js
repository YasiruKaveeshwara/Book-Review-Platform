import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("authToken"); // Check if the user is logged in

  // If the user is not logged in, redirect to the login page
  return token ? element : <Navigate to='/login' replace />;
};

export default ProtectedRoute;
