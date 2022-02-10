import React, { useState } from 'react';
import { Switch, Descriptions  } from 'antd';
import DataContract from './DataContract'
import "./styles.scss";





const Contract = () => {
  
  

const [smContract,setsmContract]=useState(DataContract)
   


  return(
  <> 

    {smContract.map((smart)=>{
      const {conaddress,conuser,image,date,investment,returnamount,requirement,status}=smart
return(
  <>
  
  <Descriptions title="CONTRACT"
   className='set'  bordered layout="vertical" size="middle"
        >
<Descriptions.Item label="Contract Id">{conaddress}</Descriptions.Item>
<Descriptions.Item label="Contract by"> <img src={image}/>{conuser }</Descriptions.Item>
<Descriptions.Item label="Date">{date}</Descriptions.Item>

<Descriptions.Item label="Status">{status}</Descriptions.Item>
<Descriptions.Item label="investment">{investment}</Descriptions.Item>
<Descriptions.Item label="return amount">{returnamount}</Descriptions.Item>
<Descriptions.Item label="Requirement">
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, 
but also the leap into electronic typesetting, remaining essentially unchanged.
</Descriptions.Item>

</Descriptions>
<br/>
<hr/>
<br/>
</>

 )
   }     
    )}
    
  </>)

};

export default Contract;
