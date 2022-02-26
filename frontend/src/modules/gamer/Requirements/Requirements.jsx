import React,{useState} from 'react'
import { Modal, Button, Form, Input, Row, Col, Avatar, Card, Divider, Typography} from 'antd';
import { Link } from 'react-router-dom'
import { CheckCircleTwoTone,  } from '@ant-design/icons'
import {data} from "./data";

function Requirements() {
  const [visible, setVisible] = useState(false)
  const { Item }= Form;
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const {Text, Title}= Typography

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = e => {
    setVisible(false);
    form.resetFields();
  };

  const handleCancel = e => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <>
        <Button type="primary" onClick={showModal}>
          Post your requirements
        </Button>
        <Modal
          title="Your Requirements"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} >
            <Item 
              name={"requirement:"}
              rules={[
                {
                  required: true,
                  message: "requirements can't be empty",
                },
              ]}>
                <TextArea autoSize placeholder="Type your requirements" />
              </Item>
          </Form>
        </Modal>
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
      </>
  )
}

export default Requirements