import React from "react";
import { useNavigate, Link } from "react-router-dom";
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
// import "./styles.scss";

const { SubMenu } = Menu;
const { Sider, Header, Footer, Content } = Layout;

const InvestorLayout = ({ children }) => {
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
                <Link to={"investor/talentPool"}>Total pool</Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<WechatOutlined />}>
                <Link to={"investor/contract"}>Contract</Link>
              </Menu.Item>
            </Menu>
          </div>
        </Sider>
        <Layout>
          <Header>{/* <div>Headerr</div> */}</Header>
          <Content>
            <div className="gamer-layout-content">{children}</div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default InvestorLayout;
