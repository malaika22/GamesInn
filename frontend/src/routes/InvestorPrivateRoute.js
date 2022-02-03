import React from "react";
import { Route, Redirect, Outlet } from "react-router-dom";
import InvestorLayout from "../components/InvestorLayout/InvestorLayout";

const InvestorPrivateRoute = ({ component: Component, ...rest }) => {
  return (
    // <Route
    //   {...rest}
    //   render={(props) =>
    //     !state.isAuthenticated ? (
    //       <Redirect to="/login" />
    //     ) : (
    //       <Component {...props} />
    //     )
    //   }
    // />
    <InvestorLayout>
      <Outlet />
    </InvestorLayout>
  );
};

export default InvestorPrivateRoute;
