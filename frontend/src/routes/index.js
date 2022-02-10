import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "../components/AuthPages/SignUp";
import SignIn from "../components/AuthPages/SignIn";
import Home from "../components/HomeLayout/Home/Home";
import GamerLayout from "../components/GamerLayout/GamerLayout";

import MyAccounts from "../modules/gamer/TradingInfo/MyAccounts";
import BuyerInfo from "../modules/gamer/TradingInfo/BuyerInfo";

import GamerPrivateRoute from "./GamerPrivateRoute";
import InvestorPrivateRoute from "./InvestorPrivateRoute";
import PostFeed from "../modules/gamer/PostFeed/PostFeed";
import Post from "../modules/gamer/PostFeed/Post";
import Contract from "../modules/investor/InvestorContracts/Contract";

const ModuleRoutes = () => {
  return (
    // DEFAULT ROUTES
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/signup" element={<SignUp />} />
      <Route exact path="/login" element={<SignIn />} />
      <Route exact path="/" element={<GamerPrivateRoute />}>
      <Route exact path="gamer/postfeed" element={<PostFeed />} />
      <Route exact path="gamer/myaccounts" element={<MyAccounts />} />
      <Route exact path="gamer/buyerinfo" element={<BuyerInfo />} />
      <Route exact path="gamer/post/:id" element={<Post />} />
      </Route>
      <Route exact element={<InvestorPrivateRoute />}>
        <Route
          exact
          path="investor/talentPool"
          element={<div/>}
        />
        <Route exact path="investor/contract" 
        element={<Contract/>} />
      </Route>
    </Routes> 
  );
};

export default ModuleRoutes;
