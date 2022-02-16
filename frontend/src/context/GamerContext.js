import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { db } from "../firebase";

export const GamerContext = createContext();

export const GamerContextProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [gamerPost, setGamerPosts] = useState([]);

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("ginn_token")}` },
  };

  const handleCreatePost = (data) => {
    const randomRank = Math.floor(Math.random() * 7);
    const accountLevel = Math.floor(Math.random() * 100) + 1;
    const kdRatio = (Math.random() * 2.5).toFixed(2);
    const ranks = [
      "Bronze",
      "Silver",
      "Gold",
      "Platinium",
      "Diamond",
      "Heroic",
      "Grandmaster",
    ];
    const skins = [
      "Blue Flame Draco (AK)",
      "Unicorn’s Rage (Golden Era) (AK)",
      "VSS Vandal Revolt",
      "Megalodon Alpha (Scar)",
      "Duke Swallowtail (AWM)",
      "VSS Pink Love",
      "Climactic Red (M1014)",
      "M4A1 Griffin’s Fury",
      "Mechanical Girl",
      "CRAZY BUNNY MP40",
      "Red Megalodon Alpha SCAR",
      "Predatory Cobra MP40",
      "Green Flame Draco M1014",
      "Blood Moon SCAR",
      "Cupid SCAR",
      "Phantom Assassin SCAR",
      "Ultimate Titan SCAR",
      "Beast SCAR",
      "Playboy AWM",
      `Tagger's Revolt AWM`,
      "Duke Swallowtail AWM",
      `Valentine's AWM`,
      `Cheetah AWM`,
      "Bluesilk Royalty bundle",
      "Modern Mafia bundle",
      "Imperial Corps bundle",
      "Dunk Master bundle",
      "Breakdancer bundle",
      "Criminal bundle",
      "Sakura bundle",
      "Hip Hop bundle",
      "Winterland Male bundle",
      "Samurai bundle",
      "Bunny bundle",
      "Joker bundle",
      "Arctic Blue bundle",
      "Cobra Rage bundle",
      "Zombified Samurai Bundle",
      "Arctic blue bundle	",
      "Doctor red bundle",
      "Mystic Evil bundle",
      `King’s sword bundle`,
      `Bandit bundle`,
      `Night Clown bundle`,
      `The Street bundle`,
    ];

    const randomSkins = [];
    for (let i = 0; i < 5; i++) {
      const rdn = Math.floor(Math.random() * 45);
      randomSkins.push(skins[rdn]);
    }

    if (data?.accountImages.length) {
      db.collection("posts").add({
        ...data,
        accountRank: ranks[randomRank],
        kdRatio: kdRatio,
        accountLevel: accountLevel,
        skins: [...randomSkins],
        isBought: false,
      });
    }
  };

  const getMyCampaigns = () => {
    const res = axios.get(
      `${process.env.REACT_APP_BACKEND_ENV}/campaign/api/v1/myAllCampaigns`
    );

    console.log("my campaigns", res);
  };

  const getActiveCampaigns = () => {
    const res = axios.get(
      `${process.env.REACT_APP_BACKEND_ENV}/campaign/api/v1/allActiveCampaigns`
    );
    console.log("active campaign", res);
  };

  const createCampaign = async (data) => {
    console.log("campaign data", data);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_ENV}campaign/api/v1/allActiveCampaigns`,
        data,
        config
      );
      console.log(res);
    } catch (err) {
      console.log(err?.response?.message);
    }
  };
  return (
    <GamerContext.Provider
      value={{
        getMyCampaigns: getMyCampaigns,
        getActiveCampaigns: getActiveCampaigns,
        handleCreatePost: handleCreatePost,
        createCampaign: createCampaign,
      }}
    >
      {children}
    </GamerContext.Provider>
  );
};
