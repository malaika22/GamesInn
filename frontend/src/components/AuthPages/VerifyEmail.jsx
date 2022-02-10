import Grid from "antd/lib/card/Grid";
import React, { useContext } from "react";
import { Navigate, useNavigate } from "react-router";
import emailVerify from "../../assests/emailVerify.svg";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/");
  };
  return (
    <div className="verify-msg-container">
      <Grid xs={24} sm={12}>
        <img src={emailVerify} />
      </Grid>
      <Grid xs={24} sm={12}>
        <div>
          A verification mail has been sent to your email address, please verify
          your account.
        </div>
        <div onClick={handleHome}>Go back to homepage</div>
      </Grid>
    </div>
  );
}
