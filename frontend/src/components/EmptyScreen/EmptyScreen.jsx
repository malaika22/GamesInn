import React from "react";
import emptyScreen from "../../assests/emptyScreen.svg";
import "./styles.scss";

const EmptyScreen = ({ title }) => {
  return (
    <div className="empty-container">
      <img src={emptyScreen} />
      <div className="empty-title">{title}</div>
    </div>
  );
};

export default EmptyScreen;
