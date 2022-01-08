import React, { useState } from "react";
import { Row, Col, Form, Input, Select, Button } from "antd";
import signUp from "../../assests/illustrations/singup.svg";
import "./styles.scss";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Option } = Select;
const SignUp = () => {
  const [signupRole, setSignupRole] = useState(null);
  const [form] = Form.useForm();
  const handleSignUp = () => {
    const formValues = form.getFieldsValue(true);
    if (!signupRole) {
      toast.error("Select a user role");
    } else {
      console.log("form values", formValues);
    }
  };
  return (
    <div className="auth-container signup-container">
      <Row>
        <Col xs={24} sm={12}>
          <div className="left-div">
            <div className="logo-title">Games Inn</div>
            <div className="title-info">
              A central hub where gamers and inventors can achieve amazing
              things together.
            </div>
            <div className="signup-image-div">
              <img src={signUp} alt="Gaming illustrator" />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div className="right-div">
            <div className="start-for-free">START FOR FREE</div>
            <h2>Sign up to Games Inn</h2>
            <div className="member">
              Already a member?{" "}
              <Link to="/signup">
                <span className="register-span">
                  Login{" "}
                  <span className="register-icon">
                    <ArrowRightOutlined />
                  </span>
                </span>
              </Link>
            </div>
            <div className="form-div">
              <Form className="form" onFinish={handleSignUp} form={form}>
                <Row gutter={{ xs: 12 }}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="firstname"
                      rules={[
                        {
                          required: true,
                          message: "Please input your first name!",
                        },
                      ]}
                      className="form-label"
                    >
                      <Input placeholder="First name" className="form-input" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="lastname"
                      rules={[
                        {
                          required: true,
                          message: "Please input your last name!",
                        },
                      ]}
                      className="form-label"
                    >
                      <Input placeholder="Last name" className="form-input" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input your user name!",
                    },
                  ]}
                  className="form-label"
                >
                  <Input placeholder="Username" className="form-input" />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                    {
                      type: "email",
                      message: "Email is not a valid email!",
                    },
                  ]}
                  className="form-label"
                >
                  <Input
                    name="email"
                    placeholder="Email"
                    className="form-input"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password",
                    },
                  ]}
                  className="form-label"
                >
                  <Input.Password
                    className="form-input"
                    placeholder="Enter your password"
                  />
                </Form.Item>
                <Row>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="country"
                      rules={[
                        {
                          required: true,
                          message: "Please select your country",
                        },
                      ]}
                      className="form-label"
                    >
                      <Select
                        className="select-input"
                        name="country"
                        defaultValue={"pakistan"}
                      >
                        <Option value="pakistan">Pakistan</Option>
                        <Option value="india">India</Option>
                        <Option value="turkey">Turkey</Option>
                        <Option value="german">German</Option>
                        <Option value="spain">Spain</Option>
                        <Option value="dubai">Dubai</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="city"
                      rules={[
                        {
                          required: true,
                          message: "Please select your city",
                        },
                      ]}
                      className="form-label"
                    >
                      <Select
                        className="select-input"
                        name="city"
                        defaultValue={"pakistan"}
                      >
                        <Option value="pakistan">Karachi</Option>
                        <Option value="india"></Option>
                        <Option value="turkey">Turkey</Option>
                        <Option value="german">German</Option>
                        <Option value="spain">Spain</Option>
                        <Option value="dubai">Dubai</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <div className="signup-role">
                  <Row>
                    <Col xs={24}>
                      <div className="signup-role-label">Signup as :</div>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>
                      <Button
                        className={`role-buttons ${
                          signupRole === "gamer" && "selected"
                        }`}
                        onClick={() => setSignupRole("gamer")}
                      >
                        Gamer
                      </Button>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>
                      <Button
                        className={`role-buttons ${
                          signupRole === "investor" && "selected"
                        }`}
                        onClick={() => setSignupRole("investor")}
                      >
                        Investor
                      </Button>
                    </Col>
                  </Row>
                  <Form.Item>
                    <Button className="submit-button" htmlType="submit">
                      Signup
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SignUp;
