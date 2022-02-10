import React, { createContext } from "react";

export const GamerContext = createContext();

export const GamerContextProvider = ({ children }) => {
  return <GamerContext.Provider>{children}</GamerContext.Provider>;
};
