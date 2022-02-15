import { Button, Spin, Card, Avatar, Typography, Col, Row, Divider} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { GamerContext } from "../../../context/GamerContext";
import SellAccountModal from "./SellAccount/SellAccountModal";
import {data} from "./data";
import { Link } from "react-router-dom";
import { CheckCircleTwoTone,  } from '@ant-design/icons'
import "./styles.scss";

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

  const { Meta }= Card;
  const {Title, Text}= Typography;
  
  useEffect(() => {
    if (accountLoader) {
      const timer = setTimeout(() => {
        console.log("This will run after 1 second!");
        setAccountLoader("Fetching details...");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [accountLoader]);

  useEffect(() => {
    if (accountLoader) {
      const timer = setTimeout(() => {
        console.log("This will run after 6000 second!");
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
              <Button onClick={() => setShowPostModal(true)}
                      className='sell-btn'>
                Sell Account
              </Button>
            </div>
            <div className="posts-card-container"></div>
          </div>
        </Spin>
      ) : (
        <div className="my-posts-container">
          <div className="posts-header">
            <Title level={3} >My Posts</Title>
            <Button className='sell-btn' onClick={() => setShowPostModal(true)}>Sell Account</Button>
          </div>
          <div className="posts">
           <Row gutter={[10,10]} >
           {data.map(post => (
              <Col span={23} >
                <Card
                headStyle={{backgroundColor: '#213956', color:'white'}}
                hoverable
                title={post.title}
                extra={post.isSold && <CheckCircleTwoTone style={{ fontSize: '25px'}} twoToneColor="#52c41a" /> }
              >
                <Row  >
                  <Col style={{display:'flex', maxWidth:'70%'}} >
                      <Col lg={2} md={4} sm={6} xs={8}>
                        <Avatar src={post.image} size='large'  />
                      </Col>
                      <Col lg={22} md={20} sm={18} xs={16}>
                       <Title level={5}>{post.gamerName}</Title>
                       <Text strong>Gaming Account: {post.game}</Text>
                       <br/>
                      <Text>{post.description}</Text>
                      </Col>
                  </Col>
                  <Col style={{maxHeight: '100%'}} >
                    <Divider type="vertical" style={{height: '100%'}} />
                  </Col>
                  <div className="price" >
                    <h2 style={{color:'inherit'}}>
                      Price: Rs.{post.price}
                    </h2>
                  </div>
                </Row>
                <Link to={`/gamer/mypost/${post.postId}`}>More...</Link>
              </Card>
              </Col>
            ))}
           </Row>
            
            
            </div>;
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
