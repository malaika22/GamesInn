import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";

export const GamerContext = createContext();

export const GamerContextProvider = ({ children }) => {
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [gamerLoading, setGamerLoading] = useState(false);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [myAccounts, setMyAccounts] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const uid = localStorage.getItem("ginn_uid");
  console.log(localStorage.getItem("ginn_token"));
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("ginn_token")}` },
  };

  // useEffect(() => {
  //   db.collection("posts")
  //     .where("createdBy", "==", uid)
  //     .onSnapshot((snapshot) => {
  //       const arrPosts = [];
  //       snapshot.forEach((dt) => {
  //         arrPosts.push(dt.data());
  //       });
  //       setGamerPosts([...arrPosts]);
  //     });
  // }, []);

  // console.log("my posts", gamerPost);

  // const handleCreatePost = (data) => {
  //   const randomRank = Math.floor(Math.random() * 7);
  //   const accountLevel = Math.floor(Math.random() * 100) + 1;
  //   const kdRatio = (Math.random() * 2.5).toFixed(2);
  //   const ranks = [
  //     "Bronze",
  //     "Silver",
  //     "Gold",
  //     "Platinium",
  //     "Diamond",
  //     "Heroic",
  //     "Grandmaster",
  //   ];
  //   const skins = [
  //     "Blue Flame Draco (AK)",
  //     "Unicorn’s Rage (Golden Era) (AK)",
  //     "VSS Vandal Revolt",
  //     "Megalodon Alpha (Scar)",
  //     "Duke Swallowtail (AWM)",
  //     "VSS Pink Love",
  //     "Climactic Red (M1014)",
  //     "M4A1 Griffin’s Fury",
  //     "Mechanical Girl",
  //     "CRAZY BUNNY MP40",
  //     "Red Megalodon Alpha SCAR",
  //     "Predatory Cobra MP40",
  //     "Green Flame Draco M1014",
  //     "Blood Moon SCAR",
  //     "Cupid SCAR",
  //     "Phantom Assassin SCAR",
  //     "Ultimate Titan SCAR",
  //     "Beast SCAR",
  //     "Playboy AWM",
  //     `Tagger's Revolt AWM`,
  //     "Duke Swallowtail AWM",
  //     `Valentine's AWM`,
  //     `Cheetah AWM`,
  //     "Bluesilk Royalty bundle",
  //     "Modern Mafia bundle",
  //     "Imperial Corps bundle",
  //     "Dunk Master bundle",
  //     "Breakdancer bundle",
  //     "Criminal bundle",
  //     "Sakura bundle",
  //     "Hip Hop bundle",
  //     "Winterland Male bundle",
  //     "Samurai bundle",
  //     "Bunny bundle",
  //     "Joker bundle",
  //     "Arctic Blue bundle",
  //     "Cobra Rage bundle",
  //     "Zombified Samurai Bundle",
  //     "Arctic blue bundle	",
  //     "Doctor red bundle",
  //     "Mystic Evil bundle",
  //     `King’s sword bundle`,
  //     `Bandit bundle`,
  //     `Night Clown bundle`,
  //     `The Street bundle`,
  //   ];

  //   const randomSkins = [];
  //   for (let i = 0; i < 5; i++) {
  //     const rdn = Math.floor(Math.random() * 45);
  //     randomSkins.push(skins[rdn]);
  //   }

  //   if (data?.accountImages.length) {
  //     db.collection("posts").add({
  //       ...data,
  //       accountRank: ranks[randomRank],
  //       kdRatio: kdRatio,
  //       accountLevel: accountLevel,
  //       skins: [...randomSkins],
  //       isBought: false,
  //     });
  //   }
  // };

  const handleCreatePost = async (data) => {
    console.log("create account", ...data);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_ENV}accounts/api/v1/createAccount`,
        data,
        config
      );
      console.log("account res", res);
      getMyAccounts();
      getAllAccounts();
    } catch (err) {
      console.log(err, err?.response);
    }
  };

  const getAllAccounts = async () => {
    setGamerLoading(true);
    console.log("all account");
    // console.log("create account", ...data);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_ENV}accounts/api/v1/getAccounts`,
        config
      );
      const filterData = res?.data?.data.filter((dt) => dt?.createdBy !== uid);
      console.log("account res", res, filterData);
      setAllAccounts(res?.data?.data);
      setGamerLoading(false);
    } catch (err) {
      setGamerLoading(false);
      console.log(err, err?.response);
    }
  };

  const getMyAccounts = async () => {
    setGamerLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_ENV}accounts/api/v1/myAccounts`,
        config
      );
      setMyAccounts(res?.data?.data);
      console.log("my accounts", res);
      setGamerLoading(false);
    } catch (err) {
      setGamerLoading(false);
      console.log(err?.response);
    }
  };

  const getMyCampaigns = async () => {
    setGamerLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_ENV}campaign/api/v1/myAllCampaigns`,
        config
      );
      setGamerLoading(false);
      setMyCampaigns(res?.data?.data);
      console.log("my campaigns", res);
    } catch (err) {
      setGamerLoading(false);
      console.log(err?.response?.data?.msg);
    }
  };

  const getActiveCampaigns = async () => {
    try {
      setGamerLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_ENV}campaign/api/v1/allActiveCampaigns`,
        config
      );
      setGamerLoading(false);
      setActiveCampaigns(res?.data?.data);
      console.log("active campaign", res);
    } catch (err) {
      console.log(err?.response?.data?.msg);
    }
  };

  const getAllCampagins = async () => {
    setGamerLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_ENV}campaign/api/v1/myAllCampaigns`,
        config
      );
      setGamerLoading(false);
      console.log(res);
      setAllCampaigns(res?.data?.data);
    } catch (err) {
      setGamerLoading(false);
      console.log(err?.response?.data?.msg);
    }
  };

  const createCampaign = async (data) => {
    console.log("campaign data", data);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_ENV}campaign/api/v1/createCampaign`,
        data,
        config
      );
      console.log(res);
      toast.success("Campaign created successfully");
    } catch (err) {
      toast.error(err?.response?.data?.msg);
      console.log(err?.response?.data?.msg);
    }
  };

  const fundCampaign = async (data) => {
    console.log("data", data);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_ENV}payment/api/v1/payme`,
        data,
        config
      );
      window.open(res?.data);
      console.log("res", res);
    } catch (err) {
      console.log(err?.response);
    }
  };
  return (
    <GamerContext.Provider
      value={{
        getMyCampaigns: getMyCampaigns,
        getActiveCampaigns: getActiveCampaigns,
        getAllCampagins: getAllCampagins,
        handleCreatePost: handleCreatePost,
        createCampaign: createCampaign,
        getAllAccounts: getAllAccounts,
        getMyAccounts: getMyAccounts,
        myAccounts: myAccounts,
        allAccounts: allAccounts,
        myCampaigns: myCampaigns,
        activeCampaigns: activeCampaigns,
        allCampaigns: allCampaigns,
        fundCampaign: fundCampaign,
        gamerLoading: gamerLoading,
      }}
    >
      {children}
    </GamerContext.Provider>
  );
};
