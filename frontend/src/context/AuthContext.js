import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const uid = localStorage.getItem("ginn_uid");

  console.log(currentUser);

  // #########################FIREBASE#############################
  useEffect(() => {
    db.collection("users").onSnapshot((doc) =>
      doc.forEach((res) => {
        console.log(res.data());
        if (res?.data()?.uid === uid) {
          console.log("same user");
          setCurrentUser(res.data());
        }
      })
    );
  }, []);

  const handleFBSignUp = async (data) => {
    setUserLoading(true);
    console.log("data", data);
    try {
      if (data?.email && data?.userName) {
        auth
          .createUserWithEmailAndPassword(data?.email, data?.password)
          .then((res) => {
            console.log("Successfully signed in");
            // Add user to database
            console.log(res);
            createUser(res.user, data);
          })
          .catch((err) => {
            toast.error(err?.message);
            console.log("Error signing up", err);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createUser = async (res, data) => {
    console.log(res);
    const userDocRef = db.collection("users").doc(res.uid);
    await userDocRef.set({
      uid: res.uid,
      ...data,
      profileImage: "",
    });
    toast.success("Account created successfully");
    window.location.href = "/login";
  };

  const handleFbLogin = ({ email, password, userType }) => {
    if (password && email) {
      auth
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          console.log(res);
          console.log("Successfully logged in", res);
          localStorage.setItem("ginn_uid", res?.user?.uid);
          localStorage.setItem("ginn_token", res?.user?.uid);
          // localStorage.setItem("ginn_type", userType);
          //Go to the home page
          // window.location.href = "/";
        })
        .catch((err) => {
          toast.error(err?.message);
          console.log("user not present");
          toast.error("User doesn't exist, please signup");
        });
    }
  };

  const updateUser = (data) => {
    console.log("data", data);
    try {
      const doc = db
        .collection("users")
        .doc(currentUser?.uid)
        .update({
          ...data,
        });
      toast.success("Account updated successsfully");
    } catch (err) {
      console.log(err);
    }
  };

  const handleFBLogout = () => {
    auth
      .signOut()
      .then((res) => {
        console.log("in handle logout");
        localStorage.clear();
        //setUsers(null)
        setCurrentUser(null);
        window.location.href = "/login";
      })
      .catch((err) => {
        console.log("error logging out", err);
      });
  };

  // #########################FIREBASE#############################

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
        userSignUp: handleFBSignUp,
        userLogin: handleFbLogin,
        currentUser: currentUser,
        userLogout: handleFBLogout,
        updateUser: updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
