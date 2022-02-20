import { Card, Row, Input, Form, Button } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserOutlined } from "@ant-design/icons";
import { AuthContext } from "../../../context/AuthContext";
import { storage } from "../../../firebase";
import "./styles.scss";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const GamerAccountSettings = () => {
  const { currentUser, handleUpdateUser, handleUpdateImage } =
    useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  // useEffect(() => {
  //   setUserDetails({
  //     firstName: currentUser?.firstName,
  //     lastName: currentUser?.lastName,
  //     userName: currentUser?.userName,
  //     profileImage: currentUser?.profileImage,
  //   });
  // }, [currentUser]);

  const updateUser = () => {
    console.log("user details", userDetails);
    if (
      !userDetails?.firstName ||
      !userDetails?.lastName ||
      !userDetails?.userName
    ) {
      toast.error("Fields can't be empty");
    } else {
      handleUpdateUser(userDetails);
    }
  };

  const handleChange = (e) => {
    console.log(e.target.value, e.target.name);
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  // const handleChangeImage = (e) => {
  //   const file = e.target.files[0];
  //   storage
  //     .ref(`accountImages/${file?.name}`)
  //     .put(file)
  //     .then((res) =>
  //       storage
  //         .ref("accountImages")
  //         .child(file.name)
  //         .getDownloadURL()
  //         .then((url) => setUserDetails({ ...userDetails, profileImage: url }))
  //     );
  // };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("profileImage", file);
    handleUpdateImage(data);
  };

  return (
    <>
      <Row className="hello">Account Settings</Row>
      <Card>
        <Form {...layout} vertical name="nest-messages">
          <div className="account-settings-container">
            {/* <div  className="account">Account Settings</div> */}
            <br />

            <div className="account-settings">
              <div className="account-image">
                {userDetails?.profileImage ? (
                  <Avatar src={userDetails?.profileImage} />
                ) : (
                  <Avatar size={70} icon={<UserOutlined />} />
                )}
                <br />
                <br />
                <label className="upload-label">
                  Upload image
                  <input
                    className="file-choose"
                    type={"file"}
                    onChange={handleChangeImage}
                  />
                </label>
              </div>
              <br />
              <div className="input-div">
                <Form.Item label="First Name" name={"firstName"}>
                  <Input
                    name="firstName"
                    style={{ width: 400 }}
                    placeholder="First name"
                    value={userDetails?.firstName}
                    onChange={handleChange}
                  />
                </Form.Item>
              </div>

              <div className="input-div">
                <Form.Item label="Last Name" name={"lastName"}>
                  <Input
                    style={{ width: 400 }}
                    name="lastName"
                    placeholder="Last name"
                    value={userDetails?.lastName}
                    onChange={handleChange}
                  />
                </Form.Item>
              </div>

              <Form.Item label="User Name" name={"userName"}>
                <Input
                  name="userName"
                  style={{ width: 400 }}
                  placeholder="User name"
                  value={userDetails?.userName}
                  onChange={handleChange}
                />
              </Form.Item>

              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 9 }}>
                <Button
                  className="btn , move"
                  type="primary"
                  onClick={updateUser}
                >
                  Save
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Card>
    </>
  );
};

export default GamerAccountSettings;
