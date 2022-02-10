import React from "react";
import { Route, Redirect, Outlet, Navigate } from "react-router-dom";
import InvestorLayout from "../components/InvestorLayout/InvestorLayout";

const InvestorPrivateRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("ginn_token");
  const gamerInfo = JSON.parse(localStorage.getItem("gamesinn_user"));
  return !token ? (
    <Navigate to="/" />
  ) : (
    gamerInfo?.verify && gamerInfo?.userType === "gamer" && (
      <InvestorLayout>
        <Outlet />
      </InvestorLayout>
    )
  );
};

export default InvestorPrivateRoute;
