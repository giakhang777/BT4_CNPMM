import { useState } from "react";
import { Button, Col, Form, Input, Row, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { forgotPasswordApi } from "../util/api.js";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ email }) => {
    setLoading(true);
    try {
      const res = await forgotPasswordApi(email);

      if (res?.EC === 0) {
        // Thông báo chung
        notification.success({
          message: "FORGOT PASSWORD",
          description: res?.EM || "If this email exists, a reset link has been sent.",
        });

        // DEV: backend trả về DT.resetURL -> điều hướng luôn
        if (res?.DT?.resetURL) {
          try {
            const url = new URL(res.DT.resetURL);
            // Tùy backend, resetURL dạng: http://localhost:5173/reset-password?token=...&email=...
            navigate(`${url.pathname}${url.search}`, { replace: true });
          } catch (e) {
            // Fallback: parse thủ công nếu cần
            const mToken = res.DT.resetURL.match(/token=([^&]+)/);
            const mEmail = res.DT.resetURL.match(/email=([^&]+)/);
            if (mToken && mEmail) {
              navigate(`/reset-password?token=${mToken[1]}&email=${mEmail[1]}`, { replace: true });
            }
          }
        }
        // PROD: không có resetURL → người dùng mở link trong email
      } else {
        notification.error({
          message: "FORGOT PASSWORD",
          description: res?.EM || "Request failed",
        });
      }
    } catch (err) {
      notification.error({
        message: "FORGOT PASSWORD",
        description: err?.message || "Network/CORS error",
      });
      console.error("forgot-password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 30 }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset style={{ padding: 15, margin: 5 }}>
          <legend>Forgot Password</legend>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true }, { type: "email" }]}
            >
              <Input placeholder="you@example.com" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Send reset link
              </Button>
            </Form.Item>
          </Form>
          <Link to="/"><ArrowLeftOutlined /> Quay lại trang chủ</Link>
        </fieldset>
      </Col>
    </Row>
  );
}
