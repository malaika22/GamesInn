import React from "react";
import { Route, Redirect, Outlet } from "react-router-dom";
import GamerLayout from "../components/GamerLayout/GamerLayout";

const GamerPrivateRoute = ({ component: Component, ...rest }) => {
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
    <GamerLayout>
      <Outlet />
    </GamerLayout>
  );
};

export default GamerPrivateRoute;
