import { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = (values: { username: string; password: string; remember: boolean }) => {
    setLoading(true);
    setTimeout(() => {
      if (values.username === "admin" && values.password === "admin") {
        login({
          id: 1,
          name: "Admin",
          email: "admin@chronos.vn",
          role: "admin",
        });
        localStorage.setItem("admin_logged_in", "true");
        message.success("Đăng nhập Admin thành công!");
        navigate("/admin");
      } else {
        message.error("Tài khoản hoặc mật khẩu không đúng!");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0a0a1a 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201, 169, 110, 0.08) 0%, transparent 70%)",
          top: "-10%",
          right: "-5%",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201, 169, 110, 0.06) 0%, transparent 70%)",
          bottom: "-5%",
          left: "-3%",
        }}
      />

      <div
        style={{
          width: 420,
          padding: "48px 40px",
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 24,
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 32px 64px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg, #c9a96e 0%, #a88a4e 100%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              color: "#fff",
              fontWeight: 800,
              marginBottom: 16,
              boxShadow: "0 8px 32px rgba(201, 169, 110, 0.35)",
            }}
          >
            C
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 4px 0",
              letterSpacing: 2,
            }}
          >
            CHRONOS
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              color: "rgba(255, 255, 255, 0.4)",
              letterSpacing: 3,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Admin Panel
          </p>
        </div>

        {/* Login Form */}
        <Form
          name="admin_login"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "rgba(255,255,255,0.3)" }} />}
              placeholder="Tài khoản"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 12,
                color: "#fff",
                height: 48,
              }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(255,255,255,0.3)" }} />}
              placeholder="Mật khẩu"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 12,
                color: "#fff",
                height: 48,
              }}
            />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              Ghi nhớ đăng nhập
            </Checkbox>
          </Form.Item>
          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 48,
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                background: "linear-gradient(135deg, #c9a96e 0%, #a88a4e 100%)",
                border: "none",
                boxShadow: "0 4px 20px rgba(201, 169, 110, 0.35)",
              }}
            >
              Đăng nhập Admin
            </Button>
          </Form.Item>
        </Form>

        <div
          style={{
            textAlign: "center",
            marginTop: 16,
            padding: "16px",
            background: "rgba(201, 169, 110, 0.06)",
            borderRadius: 12,
            border: "1px solid rgba(201, 169, 110, 0.1)",
          }}
        >
          <p style={{ color: "rgba(255, 255, 255, 0.35)", fontSize: 12, margin: 0 }}>
            Demo: <span style={{ color: "#c9a96e" }}>admin</span> / <span style={{ color: "#c9a96e" }}>admin</span>
          </p>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link to="/login" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
            ← Đăng nhập khách hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
