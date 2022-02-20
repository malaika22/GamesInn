import React,{useState} from 'react'
import { Modal, Button, Form, Input} from 'antd';

function Requirements() {
  const [visible, setVisible] = useState(false)
  const { Item }= Form;
  const { TextArea } = Input;
  const [form] = Form.useForm();

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
      </>
  )
}

export default Requirements