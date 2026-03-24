import { useState } from "react";
import { Form, Input, Button, Divider, message, Tabs } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CustomerAuthPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const handleLogin = (values: { email: string; password: string }) => {
    setLoading(true);
    setTimeout(() => {
      login({
        id: Date.now(),
        name: values.email.split("@")[0],
        email: values.email,
        role: "customer",
      });
      message.success("Đăng nhập thành công! Chào mừng bạn đến CHRONOS 🎉");
      navigate("/");
      setLoading(false);
    }, 800);
  };

  const handleRegister = (values: { name: string; email: string; phone: string; password: string }) => {
    setLoading(true);
    setTimeout(() => {
      register({
        id: Date.now(),
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: "customer",
      });
      message.success("Đăng ký thành công! Chào mừng bạn đến CHRONOS 🎉");
      navigate("/");
      setLoading(false);
    }, 800);
  };

  const inputStyle = {
    height: 48,
    borderRadius: 12,
    fontSize: 14,
  };

  const tabItems = [
    {
      key: "login",
      label: "Đăng nhập",
      children: (
        <Form form={loginForm} onFinish={handleLogin} size="large" layout="vertical">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#bbb" }} />}
              placeholder="Email"
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bbb" }} />}
              placeholder="Mật khẩu"
              style={inputStyle}
            />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <a style={{ color: "#c9a96e", fontSize: 13 }}>Quên mật khẩu?</a>
          </div>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 50,
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <Divider style={{ color: "#ccc", fontSize: 12 }}>hoặc đăng nhập với</Divider>

          <div style={{ display: "flex", gap: 12 }}>
            <Button
              block
              size="large"
              icon={<GoogleOutlined />}
              style={{
                height: 48,
                borderRadius: 12,
                fontWeight: 500,
                borderColor: "#e0e0e0",
              }}
            >
              Google
            </Button>
            <Button
              block
              size="large"
              style={{
                height: 48,
                borderRadius: 12,
                fontWeight: 500,
                borderColor: "#e0e0e0",
                fontSize: 18,
              }}
            >
              f
            </Button>
          </div>
        </Form>
      ),
    },
    {
      key: "register",
      label: "Đăng ký",
      children: (
        <Form form={registerForm} onFinish={handleRegister} size="large" layout="vertical">
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#bbb" }} />}
              placeholder="Họ và tên"
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#bbb" }} />}
              placeholder="Email"
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: "#bbb" }} />}
              placeholder="Số điện thoại"
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bbb" }} />}
              placeholder="Mật khẩu"
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bbb" }} />}
              placeholder="Xác nhận mật khẩu"
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 50,
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              Tạo tài khoản
            </Button>
          </Form.Item>
          <p style={{ textAlign: "center", fontSize: 12, color: "#999" }}>
            Bằng việc đăng ký, bạn đồng ý với{" "}
            <a style={{ color: "#c9a96e" }}>Điều khoản dịch vụ</a> và{" "}
            <a style={{ color: "#c9a96e" }}>Chính sách bảo mật</a>
          </p>
        </Form>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#faf9f6",
      }}
    >
      {/* Left: Decorative Panel */}
      <div
        style={{
          flex: "0 0 45%",
          background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0a0a1a 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 40px",
          position: "relative",
          overflow: "hidden",
        }}
        className="hidden lg:flex"
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            border: "1px solid rgba(201, 169, 110, 0.08)",
            top: "10%",
            left: "-20%",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 350,
            height: 350,
            borderRadius: "50%",
            border: "1px solid rgba(201, 169, 110, 0.05)",
            bottom: "5%",
            right: "-10%",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201, 169, 110, 0.1) 0%, transparent 70%)",
            top: "30%",
            right: "20%",
          }}
        />

        {/* Brand content */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "linear-gradient(135deg, #c9a96e 0%, #a88a4e 100%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              color: "#fff",
              fontWeight: 800,
              marginBottom: 24,
              boxShadow: "0 12px 40px rgba(201, 169, 110, 0.3)",
            }}
          >
            ⌚
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 42,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 8px 0",
              letterSpacing: 4,
            }}
          >
            CHRONOS
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255, 255, 255, 0.4)",
              letterSpacing: 5,
              textTransform: "uppercase",
              margin: "0 0 48px 0",
            }}
          >
            Luxury Watches
          </p>

          {/* Features */}
          <div style={{ textAlign: "left", maxWidth: 280, margin: "0 auto" }}>
            {[
              { icon: "✨", text: "Đồng hồ chính hãng 100%" },
              { icon: "🚚", text: "Miễn phí vận chuyển toàn quốc" },
              { icon: "🔄", text: "Đổi trả miễn phí trong 30 ngày" },
              { icon: "🛡️", text: "Bảo hành quốc tế 2 năm" },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 0",
                  borderBottom: idx < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 440 }}>
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ textAlign: "center", marginBottom: 32 }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#1a1a2e",
                  margin: 0,
                  letterSpacing: 2,
                }}
              >
                CHRONOS
              </h1>
              <p
                style={{
                  fontSize: 10,
                  color: "#c9a96e",
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Luxury Watches
              </p>
            </Link>
          </div>

          <h2
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#1a1a2e",
              marginBottom: 4,
            }}
          >
            Chào mừng bạn! 👋
          </h2>
          <p style={{ color: "#999", fontSize: 14, marginBottom: 32 }}>
            Đăng nhập hoặc tạo tài khoản để trải nghiệm mua sắm tốt nhất
          </p>

          <Tabs
            items={tabItems}
            centered
            size="large"
            style={{ marginBottom: 0 }}
          />

          <div
            style={{
              textAlign: "center",
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <p style={{ color: "#999", fontSize: 12, margin: 0 }}>
              Bạn là quản trị viên?{" "}
              <Link to="/admin/login" style={{ color: "#c9a96e", fontWeight: 600 }}>
                Đăng nhập Admin →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAuthPage;
