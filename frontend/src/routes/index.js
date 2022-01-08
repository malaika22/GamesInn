import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "../components/AuthPages/SignUp";
import SignIn from "../components/AuthPages/SignIn";

const ModuleRoutes = () => {
  return (
    // DEFAULT ROUTES
    <Routes>
      <Route exact path="/signup" element={<SignUp />} />
      <Route exact path="/login" element={<SignIn />} />
    </Routes>
  );
};

export default ModuleRoutes;
