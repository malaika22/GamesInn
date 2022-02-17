import React, { useContext, useState } from "react";
import { Button, Col, Dropdown, Layout, Menu, Row } from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined, PhoneOutlined, IdcardOutlined } from "@ant-design/icons";
import "./styles.scss";
import Avatar from "antd/lib/avatar/avatar";
import { AuthContext } from "../../../../context/AuthContext";

const NavHeader = ({ role }) => {
  const { userLogout } = useContext(AuthContext);
  const loggedInToken = localStorage.getItem("ginn_token");
  const userType = localStorage.getItem("ginn_type");
  const [current, setCurrent] = useState("home");
  const handleMenu = (e) => {
    console.log("e", e);
    setCurrent(e.key);
  };

  const handleLogout = () => {
    userLogout();
  };

  const menu = () => {
    return (
      <Menu>
        <Menu.Item>Account Settings</Menu.Item>
        <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
      </Menu>
    );
  };
  return (
    <div className="header-container">
      <Row style={{ alignItems: "center" }}>
        <Col span={4}>
          <div className="logo-div">Gi</div>
        </Col>
        <Col span={12}>
          <Menu
            onClick={handleMenu}
            selectedKeys={[current]}
            mode="horizontal"
            className="header-menu"
          >
            <Menu.Item key={"home"} icon={<HomeOutlined />}>
              Home
            </Menu.Item>
            <Menu.Item key={"contact"} icon={<PhoneOutlined />}>
              Contact
            </Menu.Item>
            <Menu.Item key={"about"} icon={<IdcardOutlined />}>
              About us
            </Menu.Item>
          </Menu>
        </Col>
        <Col span={8}>
          <div className="header-buttons">
            {loggedInToken ? (
              <>
                {userType === "GAMER" ? (
                  <span>
                    <Link to={"/gamer/postfeed"}>Dashboard</Link>
                  </span>
                ) : (
                  <div>Investor dashboard</div>
                )}

                <div className="dashboard-dropdown">
                  <Dropdown overlay={menu} trigger={["click"]}>
                    <div>Click me</div>
                  </Dropdown>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button className="auth-buttons">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="auth-buttons">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default NavHeader;
