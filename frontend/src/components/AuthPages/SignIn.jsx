import React, { useState } from "react";
import { Row, Col, Form, Input, Select, Button } from "antd";
import signUp from "../../assests/illustrations/singup.svg";
import "./styles.scss";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Option } = Select;
const SignIn = () => {
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
              New here?{" "}
              <Link to="/signup">
                <span className="register-span">
                  Register now{" "}
                  <span className="register-icon">
                    <ArrowRightOutlined />
                  </span>
                </span>
              </Link>
            </div>
            <div className="form-div">
              <Form className="form" onFinish={handleSignUp} form={form}>
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

                <div className="signup-role">
                  <Row>
                    <Col xs={24}>
                      <div className="signup-role-label">Sign In as :</div>
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
                      Sign In
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

export default SignIn;
