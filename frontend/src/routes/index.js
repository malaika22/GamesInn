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

import MyCampaigns from "../modules/gamer/campaigns/MyCampaigns";

import Contract from "../modules/investor/InvestorContracts/Contract";

import MyPosts from "../modules/gamer/MyPosts/MyPosts";
import MyPost from "../modules/gamer/MyPosts/MyPost";
import AuthPrivateRoute from "./AuthPrivateRoute";
import VerifyEmail from "../components/AuthPages/VerifyEmail";

const ModuleRoutes = () => {
  return (
    // DEFAULT ROUTES
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/verifyemail" element={<VerifyEmail />} />
      {/*************** AuthPrivateRoute *****************/}
      <Route exact element={<AuthPrivateRoute />}>
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/login" element={<SignIn />} />
      </Route>

      {/*************** GamerPrivateRoute *****************/}
      <Route exact path="/" element={<GamerPrivateRoute />}>
        <Route exact path="gamer/postfeed" element={<PostFeed />} />
        <Route exact path="gamer/myaccounts" element={<MyAccounts />} />
        <Route exact path="gamer/buyerinfo" element={<BuyerInfo />} />
        <Route exact path="gamer/post/:id" element={<Post />} />
        <Route exact path="gamer/mycampaign" element={<MyCampaigns />} />
        <Route exact path="gamer/myposts" element={<MyPosts />} />
        <Route exact path="gamer/mypost/:id" element={<MyPost />} />
      </Route>

      {/*************** InvestorPrivateRoute *****************/}
      <Route exact element={<InvestorPrivateRoute />}>
        <Route exact path="investor/talentPool" element={<div />} />
        <Route exact path="investor/contract" element={<Contract />} />
      </Route>
    </Routes>
  );
};

export default ModuleRoutes;
