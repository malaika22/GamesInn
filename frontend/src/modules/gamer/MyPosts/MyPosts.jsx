import { Button, Spin } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { GamerContext } from "../../../context/GamerContext";
import SellAccountModal from "./SellAccount/SellAccountModal";

const MyPosts = () => {
  const { handleCreatePost } = useContext(GamerContext);
  const [showPostModal, setShowPostModal] = useState(false);
  const [accountLoader, setAccountLoader] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [accountDetails, setAccountDetails] = useState({
    gamingPlatform: "",
    gamingAccount: "",
    accountDescription: "",
    accountImages: [],
    accountPrice: 0,
  });

  useEffect(() => {
    if (accountLoader) {
      const timer = setTimeout(() => {
        setAccountLoader("Fetching details...");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [accountLoader]);

  useEffect(() => {
    if (accountLoader) {
      const timer = setTimeout(() => {
        handleCreatePost({
          ...accountDetails,
          userName: currentUser?.userName,
          profileImage: currentUser?.profileImage,
          createdBy: currentUser?.uid,
        });
        setAccountLoader("");
        toast.success("Account verified successfully, post uploaded");
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [accountLoader]);

  return (
    <>
      {accountLoader ? (
        <Spin tip={accountLoader}>
          <div className="my-posts-container">
            <div className="posts-header">
              <div className="posts-heading">My Posts</div>
              <Button onClick={() => setShowPostModal(true)}>
                Sell Account
              </Button>
            </div>
            <div className="posts-card-container"></div>
          </div>
        </Spin>
      ) : (
        <div className="my-posts-container">
          <div className="posts-header">
            <div className="posts-heading">My Posts</div>
            <Button onClick={() => setShowPostModal(true)}>Sell Account</Button>
          </div>
          <div className="posts-card-container"></div>
        </div>
      )}

      {showPostModal && (
        <SellAccountModal
          cancel={setShowPostModal}
          handleCreatePost={handleCreatePost}
          setAccountLoader={setAccountLoader}
          accountDetails={accountDetails}
          setAccountDetails={setAccountDetails}
        />
      )}
    </>
  );
};

export default MyPosts;
