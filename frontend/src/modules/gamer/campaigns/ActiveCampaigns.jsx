import React from "react";
import { campaignsData } from "./campaignsData";
import { Card, Row, Col, Typography, Space, Descriptions } from "antd";
import Meta from "antd/lib/card/Meta";
import "./styles.scss";

function ActiveCampaigns() {
  const { Text, Title } = Typography;

  return (
    <>
      <Row gutter={[24, 24]}>
        {campaignsData.map((campaign) => (
          <Col xs={24} md={12} lg={8}>
            <Card
              bodyStyle={{ paddingBlock: "10px" }}
              headStyle={{ backgroundColor: "#213956" }}
              hoverable
              title={
                <Title style={{ color: "white" }} level={5}>
                  {campaign.campaignName}
                </Title>
              }
            >
              <Meta
                title="Description"
                description={campaign.campaignDescription}
              ></Meta>
              <div
                style={{
                  marginTop: "10px",
                  justifyContent: "space-between",
                  display: "flex",
                }}
              >
                <p>Target: {campaign.campaignTargetedAmount}</p>
                <p>{campaign.campaignDays} days</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default ActiveCampaigns;
