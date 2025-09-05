// src/pages/register.jsx
import React from "react";
import { Button, Col, Divider, Form, Input, Row, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { createUserApi } from "../util/api";

const RegisterPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { name, email, password } = values;
    try {
      const res = await createUserApi(name, email, password);

      // Tùy backend, chấp nhận nhiều kiểu trả về:
      const ok =
        res?.EC === 0 ||            // dạng { EC: 0, ... }
        res?.success === true ||    // dạng { success: true, ... }
        res?.id || res?._id ||      // trả về chính record đã tạo
        Array.isArray(res?.DT);     // hoặc có DT hợp lệ

      if (ok) {
        notification.success({
          message: "CREATE USER",
          description: "Success",
        });
        navigate("/login");
      } else {
        notification.error({
          message: "CREATE USER",
          description: res?.EM || res?.message || "Create user failed",
        });
      }
    } catch (err) {
      notification.error({
        message: "CREATE USER",
        description:
          err?.data?.message || err?.message || "Unexpected error occurred",
      });
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 30 }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset
          style={{
            padding: "15px",
            margin: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <legend>Đăng Ký Tài Khoản</legend>

          <Form
            name="register"
            layout="vertical"
            autoComplete="off"
            onFinish={onFinish}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Email is not valid!" },
              ]}
            >
              <Input placeholder="you@example.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Repeat password" />
            </Form.Item>

            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please input your name!" },
                { min: 2, message: "Name is too short!" },
              ]}
            >
              <Input placeholder="Your name" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                
              >
                Submit
              </Button>
            </Form.Item>
          </Form>

          <Link to="/">
            <ArrowLeftOutlined /> Quay lại trang chủ
          </Link>
          <Divider />
          <div style={{ textAlign: "center" }}>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
};

export default RegisterPage;
