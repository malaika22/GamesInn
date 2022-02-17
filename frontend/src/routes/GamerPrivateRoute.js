import React from "react";
import { Route, Redirect, Outlet, Navigate } from "react-router-dom";
import GamerLayout from "../components/GamerLayout/GamerLayout";

const GamerPrivateRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("ginn_token");
  // const gamerInfo = JSON.parse(localStorage.getItem("ginn_uDetails"));
  const userType = localStorage.getItem("ginn_type");
  return !token ? (
    <Navigate to="/" />
  ) : (
    // gamerInfo?.verified && gamerInfo?.userType === "Gamer" && (
    //   <GamerLayout>
    //     <Outlet />
    //   </GamerLayout>
    // )
    userType === "GAMER" && (
      <GamerLayout>
        <Outlet />
      </GamerLayout>
    )
  );
};

export default GamerPrivateRoute;
