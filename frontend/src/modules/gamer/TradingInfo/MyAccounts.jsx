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
      <Col className='col-b' span={8}>Account Title</Col>
      <Col className='col-b' span={4}>Seller Username</Col>
      <Col className='col-b' span={4}>AccountID</Col>
      <Col  className='col-b' span={4}>Price</Col>
      <Col  className='col-b'span={4}>Date</Col>
    
    </Row>
   
    


    
     {buyers.map((person)=>{
          const {id,title,sellername,price,date}= person
    
     return(
      <> 
      <div className='Buyer-content' >
     <Row className='row-info'   >
      <Col   className='col-a' span={8}>{title}</Col>
      <Col  className='col-a'  span={4}>{sellername}</Col>
      <Col  className='col-a'  span={4}>{id}</Col>
      <Col  className='col-a'  span={4}>{price}</Col>
      <Col  className='col-a'  span={4}>{date}</Col>

    </Row>
    
    </div></>   )
} )
}
        

</div> 
</>

)



};

export default MyAccounts;

