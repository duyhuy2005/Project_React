import { useEffect, useRef } from 'react';
import { notification } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import { useReturnStore } from '../../stores/returnStore';
import { formatPrice } from '../../data/products';

export const ReturnRequestNotification = () => {
  const returnRequests = useReturnStore((state) => state.returns);
  const prevReturnCountRef = useRef(returnRequests.length);

  useEffect(() => {
    // Chỉ hiển thị notification khi có yêu cầu mới (không phải lần đầu load)
    if (prevReturnCountRef.current > 0 && returnRequests.length > prevReturnCountRef.current) {
      const newReturn = returnRequests[0]; // Yêu cầu mới nhất
      
        if (newReturn.trangThai === 'pending') {

        notification.warning({
          message: '⚠️ Yêu cầu hoàn trả mới!',
          description: (
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>
                Mã yêu cầu: {newReturn.maHoanTra || newReturn.id}
              </p>
              <p style={{ margin: '4px 0 0 0' }}>
                Đơn hàng: {newReturn.donHang?.maDonHang || newReturn.donHangId}
              </p>
              <p style={{ margin: '4px 0 0 0' }}>
                Lý do: {getReasonLabel(newReturn.lyDo)}
              </p>
              <p style={{ margin: '4px 0 0 0', color: '#fa8c16', fontWeight: 600 }}>
                Số tiền hoàn: {formatPrice(newReturn.soTienHoanTra || 0)}
              </p>
            </div>
          ),
          icon: <RollbackOutlined style={{ color: '#fa8c16' }} />,
          placement: 'topRight',
          duration: 10,
          style: {
            background: 'linear-gradient(135deg, #fff7e6 0%, #ffffff 100%)',
            border: '2px solid #ffd591',
          },
        });
      }
    }
    
    prevReturnCountRef.current = returnRequests.length;
  }, [returnRequests]);

  return null;
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
