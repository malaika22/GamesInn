import React  ,{ useState }from 'react';
import { data } from './datamyaccounts'
import { Row, Col } from 'antd';
import "./styles.scss";
const MyAccounts = () => {
  
  const [buyers,setUsers]=useState(data);
   
return(

    <>
    <div >
    <Row className='row-info' >
      <Col className='col-b' span={10}>Account Title</Col>
      <Col className='col-b' span={5}>Seller Username</Col>
      <Col className='col-b' span={3}>AccountID</Col>
      <Col  className='col-b' span={3}>Price</Col>
      <Col  className='col-b'span={3}>Date</Col>
    
    </Row>
   
    


    
     {buyers.map((person)=>{
          const {id,title,sellername,image,price,date}= person
    
     return(
      <> 
      <div className='Buyer-content' >
     <Row className='row-info'   >
      <Col   className='col-a' span={10}><a href=''>{title}</a></Col>
      <Col  className='col-a'  span={5}>
      <img src={image}/>
        {sellername}</Col>
      <Col  className='col-a'  span={3}>{id}</Col>
      <Col  className='col-a'  span={3}>{price}</Col>
      <Col  className='col-a'  span={3}>{date}</Col>

    </Row>
    
    </div></>   )
} )
}
        

</div> 
</>

)



};

export default MyAccounts;

