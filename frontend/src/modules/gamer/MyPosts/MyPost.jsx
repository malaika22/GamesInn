import React, { useContext, useEffect, useState } from "react";
import { data } from "./data";
import { Card, Button, Typography, Tag, Col, Row, Rate, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useParams } from "react-router";
import { GamerContext } from "../../../context/GamerContext";
import { Loader } from "../../../components/Loader/Loader";

const { Meta } = Card;
const { Title } = Typography;

function MyPost() {
  const { id } = useParams();
  const { getAllAccounts, allAccounts, gamerLoading } =
    useContext(GamerContext);
  const [selectedPost, setSelectedPost] = useState(null);
  useEffect(() => {
    getAllAccounts();
  }, []);

  useEffect(() => {
    const post = allAccounts?.find((dt) => dt?._id === id);
    setSelectedPost({ ...post });
  }, [id, allAccounts?.length]);
  if (gamerLoading) {
    return <Loader />;
  }
  return (
    <Card
      hoverable
      bordered={false}
      title={
        <Title level={3} ellipsis={true}>
          {data.title}
        </Title>
      }
      cover={
        <div className="card">
          <Row className="card-sections">
            <Col className="card-sections-left" xs={24} xl={4}>
              <Avatar icon={<UserOutlined />} size={64} />
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
              <Button className="card-button Buy">Buy Now</Button>
            </Col>
          </Row>
        </div>
      }
    >
      <Meta
        title="Description"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic maiores blanditiis mollitia accusantium quibusdam dolore animi fugiat modi placeat quia sint ipsum dolorum quasi id recusandae, corporis excepturi commodi. Expedita!"
      ></Meta>
      <div className="description-images">
        {data[0].images.map((img) => (
          <img src={img} alt="account" />
        ))}
      </div>
      <Button className="card-button Contact">Contact me</Button>
    </Card>
  );
}

export default MyPost;
