import { React, useEffect } from "react";
import data from './data';
import "./styles.scss";
import { Table, Card, Divider } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShippingFast } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";

const PostFeed = () => {
    //Table

   function getRatings() {
    for(let d of data){
       // Get percentage
       const starPercentage = (d.rating / 5) * 100;
       // Round to nearest 10
       const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
 
       // Set width of stars-inner to percentage
      document.querySelector(`.post-${d.postId}.rating-stars-inner`).style.width = starPercentageRounded;
    }}
     
    useEffect(()=>{
      getRatings()
    },[])
  const columns=[
    {
      title:'Offer Title',
      align: 'center',
      render: post => <Link to={`gamer/post/${post.postId}`}>{post.titleContent.join(' | ')}</Link> 
    },
    {
      title:'Rating',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.rating - b.rating,
      align: 'center',
      render: (data)=>
     {
      return <div className="rating">
              <img src={data.image} alt="UserDispalyImage" />
              <div className="rating-right">
                <h3>{data.gamerName}</h3>
                <div className='rating-stars-outer'>
                  <div className={`post-${data.postId} rating-stars-inner`}>
                  </div>
                </div>
              </div>
            </div>
    }
    },
    {
      title:'Instant Delivery',
      dataIndex:'',
      align: 'center',
      render:()=> <>
        <FontAwesomeIcon icon={faShippingFast} size="2x" />
        <h4>fast delivery</h4>
      </>
     
    },
    {
      title:'Price',
      dataIndex:'price',
      align: 'left',
      render: price => <span>
        <h3>${price}</h3>
        <Divider type="vertical" />
        <button>BUY NOW</button>
      </span>,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.price - b.price,
    }
  ]
  
  return <div className="posts">
   <Table
    dataSource={data}
    columns={columns}
    pagination={{ pageSize: 20 }} 
    bordered
    size="middle"
    scroll={{ x: 'calc(700px + 50%)', y: 550 }}>
   </Table>
  </div>;
  
};

export default PostFeed;
