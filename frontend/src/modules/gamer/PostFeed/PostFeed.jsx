import { React, useEffect } from "react";
import data from './data';
import "./styles.scss";
import { Table } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShippingFast } from '@fortawesome/free-solid-svg-icons'

const PostFeed = () => {

   function getRatings() {
    for(let d of data){
       // Get percentage
       const starPercentage = (d.rating / 5) * 100;
       console.log(d.postId)

       // Round to nearest 10
       const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
       console.log(starPercentageRounded)
 
       // Set width of stars-inner to percentage
      document.querySelector(`.post-${d.postId}.rating-stars-inner`).style.width = starPercentageRounded;
    }}
     
    useEffect(()=>{
      getRatings()
    },[])
  const columns=[
    {
      title:'Offer Title',
      dataIndex:'titleContent',
      render: title => <a href="">{title.join(' | ')}</a>
    },
    {
      title:'Rating',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.rating - b.rating,
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
      render:()=> <>
        <FontAwesomeIcon icon={faShippingFast} size="2x" />
        <h4>fast delivery</h4>
      </>
     
    },
    {
      title:'Price',
      dataIndex:'price',
      render: price => <>
        <h3>${price}</h3>
        <button>BUY NOW</button>
      </>,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.price - b.price,
    }
  ]
  
  return <div className="posts">
   <Table
   dataSource={data}
   columns={columns}
   pagination={{ pageSize: 20 }} scroll={{ y: 240 }}
   ></Table>
  </div>;
};

export default PostFeed;
