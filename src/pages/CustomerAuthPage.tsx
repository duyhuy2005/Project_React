import { useState } from "react";
import { Form, Input, Button, Divider, message, Tabs, Checkbox, Space, Typography } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  GoogleOutlined,
  FacebookOutlined,
  AppleOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
  GiftOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const { Text } = Typography;

const CustomerAuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const handleLogin = (values: { email: string; password: string; remember?: boolean }) => {
    setLoading(true);
    setTimeout(() => {
      login({
        id: Date.now(),
        name: values.email.split("@")[0],
        email: values.email,
        role: "customer",
      });
      message.success({
        content: "Đăng nhập thành công! Chào mừng bạn đến CHRONOS 🎉",
        duration: 3,
        style: { marginTop: '20vh' }
      });
      navigate("/");
      setLoading(false);
    }, 1000);
  };

  const handleRegister = (values: { name: string; email: string; phone: string; password: string; agree?: boolean }) => {
    setLoading(true);
    setTimeout(() => {
      register({
        id: Date.now(),
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: "customer",
      });
      message.success({
        content: "Đăng ký thành công! Chào mừng bạn đến CHRONOS 🎉",
        duration: 3,
        style: { marginTop: '20vh' }
      });
      navigate("/");
      setLoading(false);
    }, 1000);
  };

  const inputStyle = {
    height: 52,
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 500,
    letterSpacing: '-0.01em',
  };

  const tabItems = [
    {
      key: "login",
      label: (
        <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>
          Đăng nhập
        </span>
      ),
      children: (
        <Form 
          form={loginForm} 
          onFinish={handleLogin} 
          size="large" 
          layout="vertical"
          className="auth-form"
        >
          <Form.Item
            name="email"
            label={<Text style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>Email</Text>}
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#c9a96e", fontSize: 16 }} />}
              placeholder="example@email.com"
              style={inputStyle}
              className="custom-input"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label={<Text style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>Mật khẩu</Text>}
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#c9a96e", fontSize: 16 }} />}
              placeholder="Nhập mật khẩu của bạn"
              style={inputStyle}
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
              className="custom-input"
            />
          </Form.Item>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox style={{ fontSize: 14, fontWeight: 500 }}>
                <span style={{ color: '#666' }}>Ghi nhớ đăng nhập</span>
              </Checkbox>
            </Form.Item>
            <a style={{ color: "#c9a96e", fontSize: 14, fontWeight: 600 }}>Quên mật khẩu?</a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="auth-button"
              style={{
                height: 56,
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                boxShadow: '0 8px 24px rgba(201, 169, 110, 0.35)',
              }}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập ngay'}
            </Button>
          </Form.Item>

          <Divider style={{ color: "#999", fontSize: 13, fontWeight: 500, margin: '28px 0' }}>
            hoặc tiếp tục với
          </Divider>

          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Button
              block
              size="large"
              icon={<GoogleOutlined style={{ fontSize: 18, color: '#DB4437' }} />}
              style={{
                height: 52,
                borderRadius: 14,
                fontWeight: 600,
                fontSize: 15,
                borderColor: "#e0e0e0",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="social-button"
            >
              Đăng nhập với Google
            </Button>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button
                block
                size="large"
                icon={<FacebookOutlined style={{ fontSize: 18, color: '#1877F2' }} />}
                style={{
                  height: 52,
                  borderRadius: 14,
                  fontWeight: 600,
                  fontSize: 15,
                  borderColor: "#e0e0e0",
                }}
                className="social-button"
              >
                Facebook
              </Button>
              <Button
                block
                size="large"
                icon={<AppleOutlined style={{ fontSize: 18 }} />}
                style={{
                  height: 52,
                  borderRadius: 14,
                  fontWeight: 600,
                  fontSize: 15,
                  borderColor: "#e0e0e0",
                }}
                className="social-button"
              >
                Apple
              </Button>
            </div>
          </Space>
        </Form>
      ),
    },
    {
      key: "register",
      label: (
        <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>
          Đăng ký
        </span>
      ),
      children: (
        <Form 
          form={registerForm} 
          onFinish={handleRegister} 
          size="large" 
          layout="vertical"
          className="auth-form"
        >
          <Form.Item
            name="name"
            label={<Text style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>Họ và tên</Text>}
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#c9a96e", fontSize: 16 }} />}
              placeholder="Nguyễn Văn A"
              style={inputStyle}
              className="custom-input"
            />
          </Form.Item>
          <Form.Item
            name="email"
            label={<Text style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>Email</Text>}
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#c9a96e", fontSize: 16 }} />}
              placeholder="example@email.com"
              style={inputStyle}
              className="custom-input"
            />
          </Form.Item>
          <Form.Item
            name="phone"
            label={<Text style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>Số điện thoại</Text>}
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" }
            ]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: "#c9a96e", fontSize: 16 }} />}
              placeholder="0912345678"
              style={inputStyle}
              className="custom-input"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label={<Text style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>Mật khẩu</Text>}
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#c9a96e", fontSize: 16 }} />}
              placeholder="Tối thiểu 6 ký tự"
              style={inputStyle}
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
              className="custom-input"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label={<Text style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>Xác nhận mật khẩu</Text>}
            dependencies={["password"]}
            hasFeedback
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
              prefix={<LockOutlined style={{ color: "#c9a96e", fontSize: 16 }} />}
              placeholder="Nhập lại mật khẩu"
              style={inputStyle}
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
              className="custom-input"
            />
          </Form.Item>
          
          <Form.Item
            name="agree"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error("Vui lòng đồng ý với điều khoản!")),
              },
            ]}
          >
            <Checkbox style={{ fontSize: 14, lineHeight: 1.6 }}>
              <span style={{ color: '#666' }}>
                Tôi đồng ý với{" "}
                <a style={{ color: "#c9a96e", fontWeight: 600 }}>Điều khoản dịch vụ</a> và{" "}
                <a style={{ color: "#c9a96e", fontWeight: 600 }}>Chính sách bảo mật</a>
              </span>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="auth-button"
              style={{
                height: 56,
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                boxShadow: '0 8px 24px rgba(201, 169, 110, 0.35)',
              }}
            >
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản miễn phí'}
            </Button>
          </Form.Item>

          {/* Benefits */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(201,169,110,0.05), rgba(201,169,110,0.02))',
            borderRadius: 14,
            padding: '16px 20px',
            marginTop: 20,
            border: '1px solid rgba(201,169,110,0.1)'
          }}>
            <Text style={{ fontSize: 13, fontWeight: 600, color: '#c9a96e', display: 'block', marginBottom: 12 }}>
              <GiftOutlined /> Đặc quyền thành viên
            </Text>
            <Space direction="vertical" size={8}>
              {[
                'Giảm 10% cho đơn hàng đầu tiên',
                'Tích điểm đổi quà hấp dẫn',
                'Ưu đãi độc quyền mỗi tháng',
              ].map((text, i) => (
                <Text key={i} style={{ fontSize: 13, color: '#666', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StarFilled style={{ color: '#c9a96e', fontSize: 10 }} /> {text}
                </Text>
              ))}
            </Space>
          </div>
        </Form>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #faf9f6 0%, #ffffff 50%, #f5f3ef 100%)",
        fontFamily: "'Inter', -apple-system, sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating decorative elements */}
      <div style={{
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,169,110,0.08), transparent)',
        top: '10%',
        right: '5%',
        filter: 'blur(60px)',
        animation: 'float 20s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,169,110,0.06), transparent)',
        bottom: '15%',
        left: '50%',
        filter: 'blur(50px)',
        animation: 'float 15s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />
      {/* Left: Decorative Panel */}
      <div
        style={{
          flex: "0 0 50%",
          background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 30%, #2a1a4e 60%, #1a1a3e 90%, #0a0a1a 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 60px",
          position: "relative",
          overflow: "hidden",
          boxShadow: '20px 0 60px rgba(0,0,0,0.3)',
        }}
        className="hidden lg:flex"
      >
        {/* Animated background elements */}
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "50%",
            border: "2px solid rgba(201, 169, 110, 0.08)",
            top: "-15%",
            left: "-20%",
            animation: "float 25s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            border: "1px solid rgba(201, 169, 110, 0.05)",
            bottom: "-10%",
            right: "-12%",
            animation: "float 18s ease-in-out infinite reverse",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201, 169, 110, 0.2) 0%, transparent 70%)",
            top: "30%",
            right: "10%",
            filter: "blur(80px)",
            animation: "pulse 10s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)",
            bottom: "25%",
            left: "15%",
            filter: "blur(60px)",
            animation: "pulse 12s ease-in-out infinite",
            animationDelay: '3s',
          }}
        />

        {/* Brand content */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 480 }}>
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 28,
              background: "linear-gradient(135deg, #c9a96e 0%, #d4af37 50%, #e0c891 100%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              color: "#fff",
              fontWeight: 800,
              marginBottom: 32,
              boxShadow: "0 20px 60px rgba(201, 169, 110, 0.5), 0 0 100px rgba(201, 169, 110, 0.3), inset 0 -2px 20px rgba(0,0,0,0.2)",
              animation: "glow 4s ease-in-out infinite",
              position: 'relative',
            }}
          >
            <span style={{ 
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              transform: 'rotate(-15deg)',
              display: 'inline-block',
            }}>⌚</span>
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 56,
              fontWeight: 900,
              background: "linear-gradient(135deg, #ffffff 0%, #e0c891 50%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: "0 0 16px 0",
              letterSpacing: 8,
              textShadow: "0 4px 30px rgba(201,169,110,0.5)",
              filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))',
            }}
          >
            CHRONOS
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(201, 169, 110, 0.9)",
              letterSpacing: 7,
              textTransform: "uppercase",
              margin: "0 0 24px 0",
              fontWeight: 700,
            }}
          >
            Luxury Watches
          </p>
          <div style={{
            width: 60,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #c9a96e, transparent)',
            margin: '0 auto 32px',
          }} />
          <p
            style={{
              fontSize: 17,
              color: "rgba(255, 255, 255, 0.8)",
              lineHeight: 1.9,
              fontWeight: 400,
              letterSpacing: '-0.01em',
              maxWidth: 420,
              margin: '0 auto 56px',
            }}
          >
            Khám phá bộ sưu tập đồng hồ cao cấp từ các thương hiệu danh tiếng.
            Mỗi chiếc đồng hồ là một tác phẩm nghệ thuật vượt thời gian.
          </p>

          {/* Features with icons */}
          <div style={{ textAlign: "left", maxWidth: 360, margin: "0 auto" }}>
            {[
              { icon: "✨", title: "Chính hãng 100%", desc: "Cam kết hàng chính hãng có nguồn gốc" },
              { icon: "🚚", title: "Miễn phí vận chuyển", desc: "Giao hàng toàn quốc, thanh toán COD" },
              { icon: "🔄", title: "Đổi trả 30 ngày", desc: "Đổi trả miễn phí trong vòng 30 ngày" },
              { icon: "🛡️", title: "Bảo hành 2 năm", desc: "Bảo hành quốc tế chính hãng" },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 18,
                  padding: "18px 22px",
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.04)",
                  marginBottom: 10,
                  transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  border: '1px solid rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                }}
                className="feature-item"
              >
                <span style={{ 
                  fontSize: 28, 
                  flexShrink: 0,
                  filter: 'drop-shadow(0 2px 8px rgba(201,169,110,0.3))',
                }}>{item.icon}</span>
                <div>
                  <div style={{ 
                    color: "#fff", 
                    fontSize: 16, 
                    fontWeight: 700, 
                    marginBottom: 6, 
                    letterSpacing: '-0.02em',
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  }}>
                    {item.title}
                  </div>
                  <div style={{ 
                    color: "rgba(255,255,255,0.6)", 
                    fontSize: 14, 
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div style={{ 
            marginTop: 56, 
            paddingTop: 36, 
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'center',
            gap: 48,
          }}>
            {[
              { num: '50+', label: 'Thương hiệu' },
              { num: '10K+', label: 'Khách hàng' },
              { num: '4.9★', label: 'Đánh giá' },
            ].map((stat, i) => (
              <div key={i} style={{ 
                textAlign: 'center',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ 
                  fontSize: 36, 
                  fontWeight: 900, 
                  background: 'linear-gradient(135deg, #c9a96e, #e0c891, #d4af37)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: 6,
                  fontFamily: "'Playfair Display', serif",
                  filter: 'drop-shadow(0 2px 10px rgba(201,169,110,0.3))',
                }}>
                  {stat.num}
                </div>
                <div style={{ 
                  fontSize: 13, 
                  color: 'rgba(255,255,255,0.6)', 
                  textTransform: 'uppercase', 
                  letterSpacing: 1.5,
                  fontWeight: 600,
                }}>
                  {stat.label}
                </div>
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
          padding: "60px 40px",
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ 
          width: "100%", 
          maxWidth: 540, 
          position: 'relative',
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: 32,
          padding: '48px 40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.8)',
        }}>
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 150,
            height: 150,
            background: 'radial-gradient(circle, rgba(201,169,110,0.12), transparent)',
            borderRadius: '50%',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            bottom: -40,
            left: -40,
            width: 120,
            height: 120,
            background: 'radial-gradient(circle, rgba(212,175,55,0.1), transparent)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }} />

          {/* Mobile logo */}
          <div className="lg:hidden" style={{ textAlign: "center", marginBottom: 44 }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <div style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: "linear-gradient(135deg, #c9a96e 0%, #d4af37 50%, #e0c891 100%)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                color: "#fff",
                marginBottom: 18,
                boxShadow: "0 12px 32px rgba(201, 169, 110, 0.4), inset 0 -2px 20px rgba(0,0,0,0.2)",
              }}>
                <span style={{ 
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  transform: 'rotate(-15deg)',
                  display: 'inline-block',
                }}>⌚</span>
              </div>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 36,
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #1a1a2e 0%, #c9a96e 50%, #1a1a2e 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  margin: "0 0 6px 0",
                  letterSpacing: 4,
                }}
              >
                CHRONOS
              </h1>
              <p
                style={{
                  fontSize: 12,
                  color: "#c9a96e",
                  letterSpacing: 6,
                  textTransform: "uppercase",
                  margin: 0,
                  fontWeight: 700,
                }}
              >
                Luxury Watches
              </p>
            </Link>
          </div>

          {/* Welcome message */}
          <div style={{ marginBottom: 40, position: 'relative', zIndex: 1 }}>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 900,
                background: "linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 10,
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}
            >
              Chào mừng bạn! 👋
            </h2>
            <p style={{ 
              color: "#666", 
              fontSize: 16, 
              marginBottom: 0, 
              lineHeight: 1.7, 
              fontWeight: 500,
              letterSpacing: '-0.01em',
            }}>
              {activeTab === 'login' 
                ? 'Đăng nhập để tiếp tục trải nghiệm mua sắm tuyệt vời'
                : 'Tạo tài khoản để nhận ưu đãi độc quyền'}
            </p>
          </div>

          {/* Tabs */}
          <Tabs
            items={tabItems}
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            size="large"
            style={{ marginBottom: 0 }}
            className="custom-tabs"
          />

          {/* Footer links */}
          <div
            style={{
              textAlign: "center",
              marginTop: 32,
              paddingTop: 28,
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Space direction="vertical" size={12}>
              <Text style={{ color: "#999", fontSize: 13, fontWeight: 500 }}>
                {activeTab === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{" "}
                <a 
                  onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                  style={{ color: "#c9a96e", fontWeight: 700, cursor: 'pointer' }}
                >
                  {activeTab === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
                </a>
              </Text>
              <Text style={{ color: "#999", fontSize: 13, fontWeight: 500 }}>
                Bạn là quản trị viên?{" "}
                <Link to="/admin/login" style={{ color: "#c9a96e", fontWeight: 700 }}>
                  Đăng nhập Admin →
                </Link>
              </Text>
            </Space>
          </div>

          {/* Security badge */}
          <div style={{
            marginTop: 32,
            padding: '16px 20px',
            background: 'rgba(201,169,110,0.05)',
            borderRadius: 12,
            border: '1px solid rgba(201,169,110,0.1)',
            textAlign: 'center',
          }}>
            <SafetyCertificateOutlined style={{ fontSize: 20, color: '#c9a96e', marginRight: 8 }} />
            <Text style={{ fontSize: 13, color: '#666', fontWeight: 600 }}>
              Thông tin của bạn được bảo mật với mã hóa SSL 256-bit
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAuthPage;
