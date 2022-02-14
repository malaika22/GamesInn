import { Input, Button } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserOutlined } from "@ant-design/icons";
import { AuthContext } from "../../../context/AuthContext";
import { storage } from "../../../firebase";

const GamerAccountSettings = () => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  useEffect(() => {
    setUserDetails({
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName,
      userName: currentUser?.userName,
      profileImage: currentUser?.profileImage,
    });
  }, [currentUser]);

  const handleUpdateUser = () => {
    console.log("handle submit");
    if (
      !userDetails?.firstName ||
      !userDetails?.lastName ||
      !userDetails?.userName
    ) {
      toast.error("Fields can't be empty");
    } else {
      updateUser(userDetails);
    }
  };

  const handleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeImage = (e) => {
    console.log(e.target.files[0], e.target);
    const file = e.target.files[0];
    storage
      .ref(`accountImages/${file?.name}`)
      .put(file)
      .then((res) =>
        storage
          .ref("accountImages")
          .child(file.name)
          .getDownloadURL()
          .then((url) => setUserDetails({ ...userDetails, profileImage: url }))
      );
  };

  console.log("userDetails", userDetails, currentUser);
  return (
    <div className="account-settings-container">
      <div>Account Settings</div>
      <div className="account-settings">
        <div className="account-image">
          {userDetails?.profileImage ? (
            <Avatar src={userDetails?.profileImage} />
          ) : (
            <Avatar size={64} icon={<UserOutlined />} />
          )}
          <label className="upload-label">
            Upload image
            <input type={"file"} onChange={handleChangeImage} />
          </label>
        </div>
        <div className="input-div">
          <div className="input-title">First Name</div>
          <Input
            placeholder="First name"
            name="firstName"
            value={userDetails?.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="input-div">
          <div className="input-title">Last Name</div>
          <Input
            placeholder="Last name"
            name="lastName"
            value={userDetails?.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="input-div">
          <div className="input-title">User name</div>
          <Input
            placeholder="User name"
            name="userName"
            value={userDetails?.userName}
            onChange={handleChange}
          />
        </div>
        <Button className="save-button" onClick={handleUpdateUser}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default GamerAccountSettings;
