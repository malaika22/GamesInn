import React, { useContext, useEffect, useState } from "react";
import data from "./data";
import { Card, Button, Typography, Tag, Col, Row } from "antd";
import { useParams } from "react-router";
import { UserOutlined } from "@ant-design/icons";
import { GamerContext } from "../../../context/GamerContext";
import Avatar from "antd/lib/avatar/avatar";
import { Loader } from "../../../components/Loader/Loader";

const { Meta } = Card;
const { Title } = Typography;

export default function Post() {
  const [selectedPost, setSelectedPost] = useState(null);
  const { id } = useParams();
  console.log("id", id, selectedPost);
  const { getAllAccounts, allAccounts, gamerLoading, fundCampaign } =
    useContext(GamerContext);
  useEffect(() => {
    getAllAccounts();
  }, []);

  useEffect(() => {
    const post = allAccounts?.find((dt) => dt?._id === id);
    setSelectedPost({ ...post });
  }, [id, allAccounts?.length]);

  console.log(selectedPost);

  if (gamerLoading) {
    return <Loader />;
  } else
    return (
      <Card
        hoverable
        bordered={false}
        title={
          <Title level={3} ellipsis={true}>
            {selectedPost?.title}
          </Title>
        }
        cover={
          <div className="card">
            <Row className="card-sections">
              <Col className="card-sections-left" xs={24} xl={4}>
                <Avatar icon={<UserOutlined />} size={64} />
                {/* <img alt="example" src={selectedPost} className="card-img" /> */}
              </Col>
              <Col className="card-sections-right" xs={24} xl={16}>
                <Title level={2}>{selectedPost?.username}</Title>
                <Title level={5} style={{ lineHeight: "1" }}>
                  Gaming Platform: {selectedPost?.gamingAccount}
                </Title>
                <Title level={5} style={{ lineHeight: "0.5" }}>
                  Rank: {selectedPost?.rank}
                </Title>
                <Title level={5} style={{ lineHeight: "0.5" }}>
                  Kill Ration: {selectedPost?.kdRatio}
                </Title>
                <div className="card-tags">
                  {selectedPost?.skins?.map((t) => (
                    <Tag style={{ margin: "2px" }} color="purple">
                      {t}
                    </Tag>
                  ))}
                </div>
                <div
                  className="account-cost"
                  style={{
                    fontSize: "20px",
                    marginTop: "15px",
                    color: "#67a367",
                  }}
                >
                  <span style={{ color: "black" }}>Price : </span>
                  {`$ ${selectedPost?.cost}`}
                </div>
                <Button
                  className="card-button Buy"
                  onClick={() =>
                    fundCampaign({ campaign_id: "6212449b9664cfadaa5b34a9" })
                  }
                >
                  Buy Now
                </Button>
              </Col>
            </Row>
          </div>
        }
      >
        <Meta
          title="Description"
          description={selectedPost?.description}
        ></Meta>
        <div className="description-images">
          <div style={{ fontSize: "20px", marginTop: "15px" }}>
            Account Images
          </div>
          {selectedPost?.images?.map((img) => (
            <img src={img?.showPath} alt="account" />
          ))}
        </div>
        <Button className="card-button Contact">Contact me</Button>
      </Card>
    );
}
