import React from 'react'
import {data} from './data';
import { Card, Button, Typography, Tag, Col, Row, Rate, } from 'antd';
import { useParams } from 'react-router';


const { Meta } = Card;
const {Title} = Typography;


function MyPost() {
    const {id} = useParams();

    return (<Card 
          hoverable
          bordered={false}
          title={<Title level={3} ellipsis={true}>{data.title}</Title>}
          cover={
            <div className="card">
              <Row className="card-sections">
                <Col className="card-sections-left" xs={24} xl={4}>
                  <img alt="example" src={data[id-1].image} className="card-img" />
                </Col>
                <Col className="card-sections-right" xs={24} xl={16}>
                  <Title level={2} >{data[id-1].gamerName}</Title>
                  <Title level={5} style={{lineHeight:'1'}}>Gaming Platform: {data[id-1].game}</Title>
                  <Rate disabled defaultValue={data[id-1].rating} />
                  <div className="card-tags">
                    {data[id-1].skins.map(t => <Tag style={{margin: '2px'}} color='purple'>{t}</Tag>)}
                  </div>
                  <Button className="card-button Buy">Buy Now</Button>
                </Col>
              </Row>
            </div>
          }
        >
          <Meta
            title='Description'
            description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic maiores blanditiis mollitia accusantium quibusdam dolore animi fugiat modi placeat quia sint ipsum dolorum quasi id recusandae, corporis excepturi commodi. Expedita!'
            >
          </Meta>
          <div className="description-images">
            {data[0].images.map(img => <img src={img} alt="account" /> )}
          </div>
          <Button className="card-button Contact">Contact me</Button>
        </Card>
        )
}

export default MyPost