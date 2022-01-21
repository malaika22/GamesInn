import React from "react";
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

const { Sider, Header, Footer, Content } = Layout;

const GamerLayout = ({ children }) => {
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
              <Menu.Item key="5" icon={<FontAwesomeIcon icon={faUsers} />}>
                Tranding Info
              </Menu.Item>
              <Menu.Item key="6" icon={<FontAwesomeIcon icon={faCogs} />}>
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
          <Footer>
            <div className="gamer-layout-footer">@footer</div>
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default GamerLayout;
