import React, { useContext, useEffect } from "react";
import { campaignsData } from "./campaignsData";
import { Card, Row, Col, Typography, Space } from "antd";
import Meta from "antd/lib/card/Meta";
import "./styles.scss";
import { GamerContext } from "../../../context/GamerContext";

function AllCampaigns() {
  const { Text, Title } = Typography;
  const { getAllCampagins, allCampaigns } = useContext(GamerContext);

  useEffect(() => {
    getAllCampagins();
  }, []);
  return (
    <>
      <Row gutter={[24, 24]}>
        {allCampaigns?.map((campaign) => (
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

export default AllCampaigns;
