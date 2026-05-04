import { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Drawer,
  Typography,
  message,
  Card,
  Row,
  Col,
  Modal,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { returnStatusConfig } from "../../stores/orderStore";
import { useReturnStore } from "../../stores/returnStore";
import type { ReturnRequest } from "../../services/returnService";
import type { ReturnStatus } from "../../stores/orderStore";
import { formatPrice } from "../../data/products";
import type { OrderItemDetail } from "../../services/orderService";
import "./AdminStyles.css";

const { Text } = Typography;

const ReturnManagementPage = () => {
  const returnRequests = useReturnStore((state) => state.returns);
  const updateReturnStatus = useReturnStore((state) => state.updateReturnStatus);
  
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);

  const filteredReturns = returnRequests.filter((r) => {
    const requestCode = (r.maHoanTra || String(r.id)).toLowerCase();
    const orderCode = String(r.donHang?.maDonHang || r.donHangId).toLowerCase();
    const reason = r.lyDo.toLowerCase();
    const matchSearch =
      requestCode.includes(searchText.toLowerCase()) ||
      orderCode.includes(searchText.toLowerCase()) ||
      reason.includes(searchText.toLowerCase());
    const matchStatus = filterStatus === "all" || r.trangThai === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleViewDetail = (returnReq: ReturnRequest) => {
    setSelectedReturn(returnReq);
    setDrawerOpen(true);
  };

  const handleUpdateStatus = (returnId: string, newStatus: ReturnStatus) => {
    Modal.confirm({
      title: 'Xác nhận cập nhật',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc muốn ${getStatusActionLabel(newStatus)} yêu cầu này?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        await updateReturnStatus(returnId, newStatus);
        if (selectedReturn?.id === returnId) {
          setSelectedReturn((prev) => (prev ? { ...prev, trangThai: newStatus } : null));
        }
        message.success(`Đã ${getStatusActionLabel(newStatus)} yêu cầu hoàn trả!`);
      },
    });
  };

  const getStatusActionLabel = (status: ReturnStatus): string => {
    const labels: Record<ReturnStatus, string> = {
      pending: "đặt về chờ xử lý",
      approved: "chấp nhận",
      rejected: "từ chối",
      completed: "hoàn thành",
    };
    return labels[status];
  };

  const getReasonLabel = (reason: string): string => {
    const reasons: Record<string, string> = {
      defective: "Sản phẩm bị lỗi / hỏng",
      wrong_item: "Nhận sai sản phẩm",
      not_as_described: "Không đúng mô tả",
      change_mind: "Đổi ý / Không cần nữa",
      size_issue: "Kích thước không phù hợp",
      other: "Lý do khác",
    };
    return reasons[reason] || reason;
  };

  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    ...Object.entries(returnStatusConfig).map(([key, val]) => ({
      value: key,
      label: val.label,
    })),
  ];

  const columns = [
    {
      title: "Mã yêu cầu",
      dataIndex: "maHoanTra",
      key: "id",
      render: (_: string, record: ReturnRequest) => (
        <Text strong style={{ color: "#fa8c16" }}>
          {record.maHoanTra || record.id}
        </Text>
      ),
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "donHangId",
      key: "orderId",
      render: (_: string, record: ReturnRequest) => (
        <Text style={{ color: "#4f46e5" }}>{record.donHang?.maDonHang || record.donHangId}</Text>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "lyDo",
      key: "reason",
      render: (reason: string) => getReasonLabel(reason),
    },
    {
      title: "Số tiền hoàn",
      dataIndex: "soTienHoanTra",
      key: "refundAmount",
      render: (amount?: number) => (
        <Text strong style={{ color: "#c9a96e" }}>
          {formatPrice(amount || 0)}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "status",
        render: (status: string) => {
          const config = returnStatusConfig[status as ReturnStatus];
          return <Tag color={config.color}>{config.label}</Tag>;
        },

    },
    {
      title: "Ngày tạo",
      dataIndex: "ngayTao",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
       render: (_: unknown, record: ReturnRequest) => (

        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý hoàn trả</h1>
        <p className="admin-page-subtitle">{returnRequests.length} yêu cầu</p>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <div className="admin-table-toolbar-left">
            <Input
              placeholder="Tìm mã yêu cầu, mã đơn..."
              prefix={<SearchOutlined style={{ color: "#999" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 280 }}
              allowClear
            />
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 180 }}
              options={statusOptions}
            />
          </div>
          <Space>
            {Object.entries(returnStatusConfig).map(([key, val]) => {
               const count = returnRequests.filter((r: ReturnRequest) => r.trangThai === key).length;

              return (
                <Tag
                  key={key}
                  color={filterStatus === key ? val.color : undefined}
                  style={{ cursor: "pointer" }}
                  onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
                >
                  {val.label}: {count}
                </Tag>
              );
            })}
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredReturns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Detail Drawer */}
      <Drawer
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <RollbackOutlined style={{ color: "#fa8c16" }} />
            <span>Chi tiết yêu cầu hoàn trả</span>
          </div>
        }
        placement="right"
        width={600}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {selectedReturn && (
          <div>
            <Card style={{ marginBottom: 16, background: "#f9fafb" }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text type="secondary">Mã yêu cầu</Text>
                  <div>
                    <Text strong style={{ color: "#fa8c16" }}>
                       {selectedReturn.maHoanTra || selectedReturn.id}

                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Mã đơn hàng</Text>
                  <div>
                    <Text strong style={{ color: "#4f46e5" }}>
                       {selectedReturn.donHang?.maDonHang || selectedReturn.donHangId}

                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Trạng thái</Text>
                  <div>
                     <Tag color={returnStatusConfig[selectedReturn.trangThai as ReturnStatus].color}>
                       {returnStatusConfig[selectedReturn.trangThai as ReturnStatus].label}

                    </Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Ngày tạo</Text>
                  <div>
                    <Text>
                       {new Date(selectedReturn.ngayTao).toLocaleString("vi-VN")}

                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>

            <Card title="Thông tin hoàn trả" style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <Text type="secondary">Lý do hoàn trả</Text>
                <div>
                   <Text strong>{getReasonLabel(selectedReturn.lyDo)}</Text>

                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <Text type="secondary">Mô tả chi tiết</Text>
                <div>
                   <Text>{selectedReturn.ghiChuQuanTri || "Không có mô tả"}</Text>

                </div>
              </div>
              <div>
                <Text type="secondary">Số tiền hoàn</Text>
                <div>
                  <Text strong style={{ fontSize: 20, color: "#c9a96e" }}>
                     {formatPrice(selectedReturn.soTienHoanTra || 0)}

                  </Text>
                </div>
              </div>
            </Card>

            <Card title="Sản phẩm hoàn trả" style={{ marginBottom: 16 }}>
               {(selectedReturn.donHang?.chiTietDonHangs || []).map((item: OrderItemDetail, idx: number) => (

                <div
                  key={idx}
                  style={{
                    padding: 12,
                    background: "#f9fafb",
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                       <Text strong>{item.tenSanPham}</Text>

                      <div>
                         <Text type="secondary">Số lượng: {item.soLuong}</Text>

                      </div>
                    </div>
                    <Text strong style={{ color: "#c9a96e" }}>
                       {formatPrice(item.gia * item.soLuong)}

                    </Text>
                  </div>
                </div>
              ))}
            </Card>

            {/* Action Buttons */}
             {selectedReturn.trangThai === "pending" && (

              <Space style={{ width: "100%", justifyContent: "center" }}>
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleUpdateStatus(selectedReturn.id, "approved")}
                  style={{ background: "#52c41a", borderColor: "#52c41a" }}
                >
                  Chấp nhận
                </Button>
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleUpdateStatus(selectedReturn.id, "rejected")}
                >
                  Từ chối
                </Button>
              </Space>
            )}

             {selectedReturn.trangThai === "approved" && (

              <Button
                type="primary"
                block
                icon={<CheckCircleOutlined />}
                onClick={() => handleUpdateStatus(selectedReturn.id, "completed")}
              >
                Đánh dấu hoàn thành
              </Button>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ReturnManagementPage;
