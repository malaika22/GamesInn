import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  const handleSignUp = async (data) => {
    console.log("singnup", data);
    setUserLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_ENV}gamer/auth/api/v1/signupGamer`,
        data
      );
      setUserLoading(false);
      console.log("signup res", res);
      localStorage.setItem("ginn_userDetails", JSON.stringify(res?.data?.data));
      // window.location.pathname = "/verifyemail";
    } catch (err) {
      console.log("err", err?.response?.data?.errors);
      toast.error(err?.response?.data?.errors);
    }
  };

  const handleSignIn = async ({ email, password, userType }) => {
    setUserLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_ENV}gamer/auth/api/v1/login`,
        {
          email,
          password,
        }
      );
      console.log("login res", res);
      localStorage.setItem("ginn_token", res?.data?.data?.accessToken);
      localStorage.setItem("ginn_uid", res?.data?.data?.userID);
      localStorage.setItem(
        "ginn_uDetails",
        JSON.stringify({
          userType: res?.data?.data?.userType,
          username: res?.data?.data?.username,
          verified: res?.data?.data?.verified,
          email: res?.data?.data?.email,
        })
      );
      window.location.href = "/";
      setCurrentUser(res?.data);
      setUserLoading(false);
    } catch (err) {
      console.log("err", err?.response?.data.msg);
    }
  };

  const handleLogout = () => {
    setUserLoading(true);
    localStorage.clear();
    toast.success("Logged out successfully");
    setTimeout(() => {
      setUserLoading(false);
      window.location.href = "/";
    }, 300);
  };

  return (
    <AuthContext.Provider
      value={{
        userSignUp: handleSignUp,
        userLogin: handleSignIn,
        currentUser: currentUser,
        userLogout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
