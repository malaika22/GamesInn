import React ,{ useState } from 'react'
import { data } from './databuyerinfo'
import { Row, Col } from 'antd';
import "./styles.scss";


const BuyerInfo=()=>{
    const [buyers,setUsers]=useState(data);
    
return(

    <>
    <div >
    <Row className='row-info' >
      <Col className='col-b' span={10}>Account Title</Col>
      <Col className='col-b' span={5}> Buyer Username</Col>
      <Col className='col-b' span={3}>AccountID</Col>
      <Col  className='col-b' span={3}>Price</Col>
      <Col  className='col-b'span={3}>Date</Col>
    
    </Row>
   
    


    
     {buyers.map((person)=>{
          const {id,title,buyername,image,price,date}= person
    
     return(
      <> 
      <div className='Buyer-content' >
     <Row className='row-info'   >
      <Col   className='col-a' span={10}><a href=''>{title}</a></Col>
      <Col  className='col-a'span={5}>
        <img src={image}/>
        {buyername}</Col>
      <Col  className='col-a'span={3}>{id}</Col>
      <Col  className='col-a'  span={3}>{price}</Col>
      <Col  className='col-a'  span={3}>{date}</Col>

    </Row>
    
    </div></>   )
} )
}
        

</div> 
</>

)





}
export default BuyerInfo