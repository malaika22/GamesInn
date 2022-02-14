import React, { useContext, useState } from "react";
import { storage } from "../../../../firebase";
import { Button, Modal, Row, Col, Select, Form, Input, Upload } from "antd";
import uploadIcon from "../../../../assests/uploadIcon.png";
import "./styles.scss";
import { toast } from "react-toastify";
import { AuthContext } from "../../../../context/AuthContext";

const StepOne = ({ accountDetails, setAccountDetails, setStepCount }) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { TextArea } = Input;
  const handleFinish = () => {
    const values = form.getFieldsValue();
    setAccountDetails({
      ...accountDetails,
      ...values,
    });
    setStepCount(1);
  };
  return (
    <>
      <div>Account Details</div>
      <div className="account-details">
        <Form form={form} onFinish={handleFinish}>
          <Form.Item
            name={"gamingPlatform"}
            rules={[
              {
                required: true,
                message: "Gaming platform can't be empty",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select a gaming platform"
              optionFilterProp="children"
              // onChange={onChange}
              // onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="COD">Call of duty</Option>
              <Option value="freefire">Freefire</Option>
              <Option value="pubg">Pubg</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={"gamingAccount"}
            rules={[
              {
                required: true,
                message: "Gaming account name can't be empty",
              },
            ]}
          >
            <Input placeholder="Gaming account name" />
          </Form.Item>
          <Form.Item
            name={"accountDescription"}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value?.length > 100) {
                    return Promise.resolve();
                  } else if (!value) {
                    return Promise.reject(
                      new Error("Account description can't be empty")
                    );
                  } else {
                    return Promise.reject(
                      new Error(
                        "Account description can't be less than 300 letters"
                      )
                    );
                  }
                },
              }),
            ]}
          >
            <TextArea autoSize placeholder="Gaming description" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

const StepTwo = ({
  accountDetails,
  setAccountDetails,
  setAccountLoader,
  cancel,
}) => {
  const [accountImages, setAccountImages] = useState(null);
  const [accountPrice, setAccountPrice] = useState(0);

  const handleImageChange = (e) => {
    setAccountImages(e.fileList);
  };

  const handlePriceChange = (e) => {
    if (!isNaN(e.target.value)) {
      setAccountPrice(e.target.value);
    }
  };

  const handlePostAccount = async () => {
    if (!accountImages?.length) {
      toast.error("Account images can't be empty");
    } else if (!accountPrice) {
      toast.error("Account price can't be zero");
    } else {
      const imagesUrlsArr = [];
      const check = await accountImages.map((img) => {
        const uploadTask = storage
          .ref(`/postImages/${img?.originFileObj?.name}`)
          .put(img?.originFileObj)
          .then((res) =>
            storage
              .ref("postImages")
              .child(img.name)
              .getDownloadURL()
              .then((url) => {
                console.log("running");
                imagesUrlsArr.push(url);
              })
          )
          .catch((err) => console.log(err));
      });

      setAccountDetails({
        ...accountDetails,
        accountImages: imagesUrlsArr,
        accountPrice: accountPrice,
      });

      cancel(false);
      setAccountLoader("Verifying your account......");
    }
  };

  return (
    <>
      <div>Account Images</div>
      <div className="account-images">
        <Upload
          multiple
          listType="picture"
          className="upload-input"
          // fileList={project.fileList}
          beforeUpload={() => false}
          onChange={handleImageChange}
        >
          <div className="upload-div">
            <div className="upload-icon">
              <img src={uploadIcon} alt="Upload icon" />
            </div>
            <div className="upload-title">Upload your account photos here</div>
            <div className="upload-button">Browse Files</div>
          </div>
        </Upload>
        <div className="budget-div">
          <Input
            placeholder="Account price"
            maxLength={10}
            name="accountPrice"
            onChange={handlePriceChange}
          />
        </div>
        <Button onClick={handlePostAccount}>Verify my account</Button>
      </div>
    </>
  );
};

const SellAccountModal = ({
  cancel,
  handleCreatePost,
  setAccountLoader,
  accountDetails,
  setAccountDetails,
}) => {
  const { currentUser } = useContext(AuthContext);

  const [stepCount, setStepCount] = useState(0);
  const renderSteps = () => {
    return !stepCount ? (
      <StepOne
        accountDetails={accountDetails}
        setAccountDetails={setAccountDetails}
        setStepCount={setStepCount}
      />
    ) : (
      <StepTwo
        accountDetails={accountDetails}
        setAccountDetails={setAccountDetails}
        handleCreatePost={handleCreatePost}
        setAccountLoader={setAccountLoader}
        cancel={cancel}
      />
    );
  };
  return (
    <Modal
      visible={true}
      footer={null}
      title="Sell Account"
      onCancel={() => cancel(false)}
    >
      <div className="modal-body">
        <Row>
          <Col xs={8}>
            <div>Some background with gaming wordings</div>
          </Col>
          <Col xs={16}>
            <div className="account-details-container">{renderSteps()}</div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default SellAccountModal;
