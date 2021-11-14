import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "../components/Signup/SignUp";
import SignIn from "../components/SignIn/SignIn";

const ModuleRoutes = () => {
  return (
    // DEFAULT ROUTES
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />
    </Routes>
  );
};

export default ModuleRoutes;
