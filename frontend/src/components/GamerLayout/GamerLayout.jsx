import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faFileContract,
  faUsers,
  faCogs,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  ContainerOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import "./styles.scss";

const { SubMenu } = Menu;
const { Sider, Header, Footer, Content } = Layout;

const GamerLayout = ({ children }) => {
  //route change for my acc
  const history = useNavigate();
  const routeChange = () => {
    history("/myaccounts");
  };
  // change route for buyer info
  const routeChangebuyer = () => {
    history("/buyerinfo");
  };

  console.log("Checkcing git");
  return (
    <div className="gamer-layout-container">
      <Layout>
        <Sider>
          <div className="gamer-layout-sider">
            <div className="logo">Games inn</div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
              <Menu.Item key="1" icon={<ContainerOutlined />}>
                Feed
              </Menu.Item>
              <Menu.Item key="2" icon={<WechatOutlined />}>
                Chat
              </Menu.Item>
              <Menu.Item
                key="3"
                icon={<FontAwesomeIcon icon={faFileContract} />}
              >
                Contracts
              </Menu.Item>
              <Menu.Item key="4" icon={<UploadOutlined />}>
                My posts
              </Menu.Item>
              <SubMenu
                key="5"
                icon={<FontAwesomeIcon icon={faUsers} />}
                title="Tranding Info"
              >
                <Menu.Item key="6" onClick={routeChange}>
                  My accounts
                </Menu.Item>
                <Menu.Item key="7" onClick={routeChangebuyer}>
                  Buyer Information
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="8" icon={<FontAwesomeIcon icon={faCogs} />}>
                Settings
              </Menu.Item>
            </Menu>
          </div>
        </Sider>
        <Layout>
          <Header>
            <div>Headerr</div>
          </Header>
          <Content>
            <div className="gamer-layout-content">{children}</div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default GamerLayout;
