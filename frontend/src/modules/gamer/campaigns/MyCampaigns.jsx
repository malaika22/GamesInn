import {React,useState} from 'react'
import { campaignsData } from './campaignsData'
import {Card, Row, Col, Typography,Modal, Button,Form, Input, InputNumber, Space,} from 'antd'
import Meta from 'antd/lib/card/Meta';
import './styles.scss'




const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };




function MyCampaigns() {

  const {Text, Title}= Typography;


//modal
const [isModalVisible, setIsModalVisible] = useState(false);
const showModal = () => {
  setIsModalVisible(true);
};

const handleOk = () => {

  setIsModalVisible(false);
};

const handleCancel = () => {
  setIsModalVisible(false);
};
//modal






  return (
    <>
    <div className='create-campaign'>
    <br/>
    Create a new camapaign
    <Button  className='camp-button'  type="primary" onClick={showModal}>
         Campaign
      </Button>
     
      <Modal title="New Campaign" className='btn' visible={isModalVisible} onOk={handleOk } onCancel={handleCancel}>
      
      <Form {...layout}>
      <Form.Item
       
        label="Campaign Name"
        
      >
        <Input />
      </Form.Item>
      
        
      <Form.Item
      
        label="Campaign Days"
       
      >
        <InputNumber />
      </Form.Item>
      <Form.Item  label="Target Amount">
        <InputNumber />
      </Form.Item>
      <Form.Item  label="Description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button className='btn' type="primary" htmlType="submit" onClick={handleOk}>
          Submit
        </Button>
      </Form.Item>
    </Form>
      </Modal>
      <br/>
      </div>







        <Row gutter={[24,24]}>
            {campaignsData.map(campaign => (
                 <Col xs={24} md={12} lg={8} >
                    <Card
                        bodyStyle={{paddingBlock: '10px'}}
                        headStyle={{backgroundColor: '#213956'}}
                        hoverable
                        title={<Title style={{color: 'white'}} level={5}>{campaign.campaignName}</Title>}
                        >
                            <Meta 
                                title='Description'
                                description={campaign.campaignDescription}
                            ></Meta>
                            <div style={{marginTop: '10px',justifyContent: 'space-between', display:'flex'}} >
                                <p >Target: {campaign.campaignTargetedAmount}</p>
                                <p>{campaign.campaignDays} days</p>
                            </div>
                    </Card>
                </Col>
            ))}
        </Row>
    </>
  )
}

export default MyCampaigns