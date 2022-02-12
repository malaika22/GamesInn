import axios from "axios";
import React, { createContext, useState } from "react";

export const GamerContext = createContext();

export const GamerContextProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
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
  return (
    <GamerContext.Provider
      value={{
        getMyCampaigns: getMyCampaigns,
        getActiveCampaigns: getActiveCampaigns,
      }}
    >
      {children}
    </GamerContext.Provider>
  );
};
