import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Divider,
  message,
  Avatar,
  Upload,
  Row,
  Col,
  Tabs,
  Typography,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SaveOutlined,
  BellOutlined,
  LockOutlined,
  SettingOutlined,
  GlobalOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import "./AdminStyles.css";

const { Text } = Typography;

const SettingsPage = () => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = () => {
    profileForm.validateFields().then(() => {
      setLoading(true);
      setTimeout(() => {
        message.success("Cập nhật hồ sơ thành công!");
        setLoading(false);
      }, 600);
    });
  };

  const handleChangePassword = () => {
    passwordForm.validateFields().then(() => {
      setLoading(true);
      setTimeout(() => {
        message.success("Đổi mật khẩu thành công!");
        passwordForm.resetFields();
        setLoading(false);
      }, 600);
    });
  };

  const tabItems = [
    {
      key: "profile",
      label: (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          Hồ sơ
        </span>
      ),
      children: (
        <Card
          style={{ borderRadius: 16, border: "1px solid rgba(0,0,0,0.04)" }}
          styles={{ body: { padding: 32 } }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 32,
              padding: 24,
              background: "#f8f9fa",
              borderRadius: 16,
            }}
          >
            <Avatar
              size={80}
              style={{
                background: "linear-gradient(135deg, #c9a96e, #a88a4e)",
                fontSize: 32,
                fontWeight: 700,
              }}
              icon={<UserOutlined />}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: "#1a1a2e" }}>
                Admin CHRONOS
              </div>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Quản trị viên hệ thống
              </Text>
              <div style={{ marginTop: 8 }}>
                <Upload showUploadList={false}>
                  <Button size="small" icon={<PictureOutlined />}>
                    Đổi ảnh đại diện
                  </Button>
                </Upload>
              </div>
            </div>
          </div>

          <Form
            form={profileForm}
            layout="vertical"
            initialValues={{
              name: "Admin",
              email: "admin@chronos.vn",
              phone: "0901234567",
              role: "admin",
            }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="phone" label="Số điện thoại">
                  <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="role" label="Vai trò">
                  <Select
                    options={[
                      { value: "admin", label: "Quản trị viên" },
                      { value: "editor", label: "Biên tập viên" },
                      { value: "viewer", label: "Người xem" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveProfile}
                loading={loading}
              >
                Lưu thay đổi
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: "security",
      label: (
        <span>
          <LockOutlined style={{ marginRight: 8 }} />
          Bảo mật
        </span>
      ),
      children: (
        <Card
          style={{ borderRadius: 16, border: "1px solid rgba(0,0,0,0.04)" }}
          styles={{ body: { padding: 32 } }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, color: "#1a1a2e" }}>
            <LockOutlined style={{ marginRight: 8 }} />
            Đổi mật khẩu
          </h3>
          <Form form={passwordForm} layout="vertical" style={{ maxWidth: 480 }}>
            <Form.Item
              name="currentPassword"
              label="Mật khẩu hiện tại"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại!" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu hiện tại" />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu mới" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleChangePassword}
                loading={loading}
              >
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: "notifications",
      label: (
        <span>
          <BellOutlined style={{ marginRight: 8 }} />
          Thông báo
        </span>
      ),
      children: (
        <Card
          style={{ borderRadius: 16, border: "1px solid rgba(0,0,0,0.04)" }}
          styles={{ body: { padding: 32 } }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, color: "#1a1a2e" }}>
            <BellOutlined style={{ marginRight: 8 }} />
            Cài đặt thông báo
          </h3>
          {[
            {
              title: "Đơn hàng mới",
              desc: "Nhận thông báo khi có đơn hàng mới",
              defaultChecked: true,
            },
            {
              title: "Cập nhật trạng thái đơn",
              desc: "Nhận thông báo khi trạng thái đơn hàng thay đổi",
              defaultChecked: true,
            },
            {
              title: "Đánh giá sản phẩm mới",
              desc: "Nhận thông báo khi khách hàng đánh giá sản phẩm",
              defaultChecked: false,
            },
            {
              title: "Khách hàng mới",
              desc: "Nhận thông báo khi có khách hàng đăng ký mới",
              defaultChecked: true,
            },
            {
              title: "Cảnh báo hết hàng",
              desc: "Nhận thông báo khi sản phẩm sắp hết hàng",
              defaultChecked: true,
            },
            {
              title: "Báo cáo hàng tuần",
              desc: "Nhận email tổng hợp báo cáo mỗi tuần",
              defaultChecked: false,
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 0",
                borderBottom:
                  index < 5 ? "1px solid rgba(0,0,0,0.04)" : "none",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a2e" }}>
                  {item.title}
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {item.desc}
                </Text>
              </div>
              <Switch defaultChecked={item.defaultChecked} />
            </div>
          ))}
          <Divider />
          <Button type="primary" icon={<SaveOutlined />} onClick={() => message.success("Đã lưu cài đặt thông báo!")}>
            Lưu cài đặt
          </Button>
        </Card>
      ),
    },
    {
      key: "general",
      label: (
        <span>
          <SettingOutlined style={{ marginRight: 8 }} />
          Chung
        </span>
      ),
      children: (
        <Card
          style={{ borderRadius: 16, border: "1px solid rgba(0,0,0,0.04)" }}
          styles={{ body: { padding: 32 } }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, color: "#1a1a2e" }}>
            <GlobalOutlined style={{ marginRight: 8 }} />
            Cài đặt chung
          </h3>
          <Form layout="vertical" style={{ maxWidth: 480 }}>
            <Form.Item label="Ngôn ngữ">
              <Select
                defaultValue="vi"
                options={[
                  { value: "vi", label: "🇻🇳 Tiếng Việt" },
                  { value: "en", label: "🇺🇸 English" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Múi giờ">
              <Select
                defaultValue="asia_hcm"
                options={[
                  { value: "asia_hcm", label: "Asia/Ho_Chi_Minh (UTC+7)" },
                  { value: "asia_hn", label: "Asia/Ha_Noi (UTC+7)" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Định dạng tiền tệ">
              <Select
                defaultValue="vnd"
                options={[
                  { value: "vnd", label: "VNĐ (₫)" },
                  { value: "usd", label: "USD ($)" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Số sản phẩm mỗi trang">
              <Select
                defaultValue="10"
                options={[
                  { value: "5", label: "5" },
                  { value: "10", label: "10" },
                  { value: "20", label: "20" },
                  { value: "50", label: "50" },
                ]}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={() => message.success("Đã lưu cài đặt!")}>
                Lưu cài đặt
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Cài đặt</h1>
        <p className="admin-page-subtitle">Quản lý tài khoản và cấu hình hệ thống</p>
      </div>

      <Tabs items={tabItems} tabPosition="left" style={{ minHeight: 500 }} />
    </div>
  );
};

export default SettingsPage;
