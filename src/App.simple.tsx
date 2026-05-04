function SimpleApp() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#c9a96e' }}>🎉 CHRONOS - Đồng Hồ Cao Cấp</h1>
      <p>Frontend đang chạy thành công!</p>
      
      <div style={{ marginTop: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Kiểm tra Backend API:</h2>
        <button 
          onClick={async () => {
            try {
              const response = await fetch('http://localhost:5001/api/health');
              const data = await response.json();
              alert('✅ Backend hoạt động!\n\n' + JSON.stringify(data, null, 2));
            } catch (error) {
              alert('❌ Lỗi kết nối Backend:\n' + error);
            }
          }}
          style={{
            padding: '10px 20px',
            background: '#c9a96e',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginRight: '10px'
          }}
        >
          Test Health API
        </button>
        
        <button 
          onClick={async () => {
            try {
              const response = await fetch('http://localhost:5001/api/products');
              const data = await response.json();
              console.log('Products:', data);
              alert('✅ Có ' + data.data.length + ' sản phẩm!\n\nXem Console (F12) để xem chi tiết.');
            } catch (error) {
              alert('❌ Lỗi:\n' + error);
            }
          }}
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Test Products API
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Links:</h3>
        <ul>
          <li><a href="http://localhost:5001" target="_blank">Backend API Root</a></li>
          <li><a href="http://localhost:5001/api-docs" target="_blank">Swagger API Docs</a></li>
        </ul>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', background: '#fff3cd', borderRadius: '5px' }}>
        <strong>⚠️ Lưu ý:</strong> Nếu bạn thấy trang này, nghĩa là:
        <ul>
          <li>✅ Frontend React đang chạy</li>
          <li>✅ Vite đang hoạt động</li>
          <li>❌ App.tsx gốc có lỗi</li>
        </ul>
      </div>
    </div>
  );
}

export default SimpleApp;
