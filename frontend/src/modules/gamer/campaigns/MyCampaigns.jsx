import { React, useContext, useState } from "react";
import { campaignsData } from "./campaignsData";
import {
  Card,
  Row,
  Col,
  Typography,
  Modal,
  Button,
  Form,
  Input,
  InputNumber,
  Space,
} from "antd";
import Meta from "antd/lib/card/Meta";
import "./styles.scss";
import { GamerContext } from "../../../context/GamerContext";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

function MyCampaigns() {
  const [form] = Form.useForm();
  const { Text, Title } = Typography;
  const { createCampaign } = useContext(GamerContext);
  //modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFinish = () => {
    console.log(form.getFieldsValue());
    const data = form.getFieldsValue();
    createCampaign(data);
  };
  //modal

  return (
    <>
      <div className="create-campaign">
        <br />
        Create a new camapaign
        <Button className="camp-button" type="primary" onClick={showModal}>
          Campaign
        </Button>
        <Modal
          title="New Campaign"
          className="btn"
          visible={isModalVisible}
          // onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <Form {...layout} form={form} onFinish={handleFinish}>
            <Form.Item
              label="Campaign Name"
              name={"campaignName"}
              rules={[
                { required: true, message: "Campaign name can't be empty" },
              ]}
            >
              <Input name="campaignName" />
            </Form.Item>

            <Form.Item
              label="Campaign Days"
              name="campaignDays"
              rules={[
                { required: true, message: "Campaign days can't be empty" },
              ]}
            >
              <InputNumber name="campaignDays" />
            </Form.Item>
            <Form.Item
              label="Target Amount"
              name={"campaignTargetedAmount"}
              rules={[
                { required: true, message: "Campaign amount can't be empty" },
              ]}
            >
              <InputNumber name="campaignTargetedAmount" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="campaignDescription"
              rules={[
                {
                  required: true,
                  message: "Campaign description can't be empty",
                },
              ]}
            >
              <Input.TextArea name="campaignDescription" />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button
                className="btn"
                type="primary"
                htmlType="submit"
                // onClick={handleOk}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <br />
      </div>

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

export default MyCampaigns;
