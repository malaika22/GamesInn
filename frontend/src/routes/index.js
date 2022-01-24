import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "../components/AuthPages/SignUp";
import SignIn from "../components/AuthPages/SignIn";
import Home from "../components/HomeLayout/Home/Home";
import GamerLayout from "../components/GamerLayout/GamerLayout";
import BuyerInfo from "../modules/gamer/TradingInfo/BuyerInfo";
import MyAccounts from "../modules/gamer/TradingInfo/MyAccounts";
import GamerPrivateRoute from "./GamerPrivateRoute";
import PostFeed from "../modules/gamer/PostFeed/PostFeed";

const ModuleRoutes = () => {
  return (
    // DEFAULT ROUTES
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/signup" element={<SignUp />} />
      <Route exact path="/login" element={<SignIn />} />
      <Route exact path="/" element={<GamerPrivateRoute />}>
        <Route exact path="/postfeed" element={<PostFeed />} />
        <Route exact path="/buyerinfo" element={<BuyerInfo />} />
        <Route exact path="/myaccounts" element={<MyAccounts />} />
      </Route>
    </Routes>
  );
};

export default ModuleRoutes;
