import React, { useState } from "react";
import { Button, Col, Layout, Menu, Row } from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined, PhoneOutlined, IdcardOutlined } from "@ant-design/icons";
import "./styles.scss";

const NavHeader = ({ role }) => {
  const loggedInToken = localStorage.getItem("gm_token");
  const [current, setCurrent] = useState("home");
  const handleMenu = (e) => {
    console.log("e", e);
    setCurrent(e.key);
  };
  const renderHeader = () => {
    switch (role) {
      case "gamer":
        return <div>Gamer header</div>;
      case "investor":
        return <div>investor header</div>;
        return;
    }
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
            <Link to="/login">
              <Button className="auth-buttons">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="auth-buttons">Sign up</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default NavHeader;
