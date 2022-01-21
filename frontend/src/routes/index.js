import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "../components/AuthPages/SignUp";
import SignIn from "../components/AuthPages/SignIn";
import Home from "../components/HomeLayout/Home/Home";
import GamerLayout from "../components/GamerLayout/GamerLayout";
import GamerPrivateRoute from "./GamerPrivateRoute";
import Posts from "../modules/gamer/Posts/Posts";

const ModuleRoutes = () => {
  return (
    // DEFAULT ROUTES
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/signup" element={<SignUp />} />
      <Route exact path="/login" element={<SignIn />} />
      <Route exact path="/" element={<GamerPrivateRoute />}>
        <Route exact path="/posts" element={<Posts />} />
      </Route>
    </Routes>
  );
};

export default ModuleRoutes;
