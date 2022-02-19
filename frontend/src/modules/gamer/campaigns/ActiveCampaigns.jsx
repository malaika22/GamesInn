import React, { useContext, useEffect } from "react";
import { campaignsData } from "./campaignsData";
import { Card, Row, Col, Typography, Space, Descriptions, Button } from "antd";
import Meta from "antd/lib/card/Meta";
import "./styles.scss";
import { GamerContext } from "../../../context/GamerContext";

function ActiveCampaigns() {
  const { Text, Title } = Typography;
  const { getActiveCampaigns, activeCampaigns, fundCampaign } =
    useContext(GamerContext);

  useEffect(() => {
    getActiveCampaigns();
  }, []);

  const handleFundCampaign = (id) => {
    fundCampaign({
      campaign_id: id,
    });
  };
  return (
    <>
      <Row gutter={[24, 24]}>
        {activeCampaigns?.map((campaign) => (
          <Col xs={24} md={12} lg={8}>
            <Card
              bodyStyle={{ paddingBlock: "10px" }}
              headStyle={{ backgroundColor: "#213956" }}
              hoverable
              title={
                <>
                  <Title style={{ color: "white" }} level={5}>
                    {campaign.campaignName}
                  </Title>
                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "14px",
                      color: "white",
                    }}
                  >
                    Created by : {campaign?.userName}
                  </div>
                </>
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
                <p>
                  <span>Duration : </span>
                  {campaign.campaignDays} days
                </p>
              </div>
              <Button onClick={() => handleFundCampaign(campaign?._id)}>
                Fund Campaign
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default ActiveCampaigns;
