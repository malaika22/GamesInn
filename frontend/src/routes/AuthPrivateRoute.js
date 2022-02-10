import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthPrivateRoute = ({ children }) => {
  const token = localStorage.getItem("ginn_token");
  return !token ? <Outlet /> : <Navigate to="/" />;
};

export default AuthPrivateRoute;
