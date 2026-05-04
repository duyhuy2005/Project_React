import { BrowserRouter } from "react-router-dom";

function TestApp() {
  return (
    <BrowserRouter>
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h1>🎉 Test App - Frontend đang hoạt động!</h1>
        <p>Backend API: <a href="http://localhost:5001" target="_blank">http://localhost:5001</a></p>
        <p>Swagger: <a href="http://localhost:5001/api-docs" target="_blank">http://localhost:5001/api-docs</a></p>
        
        <h2>Kiểm tra kết nối API:</h2>
        <button onClick={async () => {
          try {
            const response = await fetch('http://localhost:5001/api/health');
            const data = await response.json();
            alert('API hoạt động: ' + JSON.stringify(data));
          } catch (error) {
            alert('Lỗi kết nối API: ' + error);
          }
        }}>
          Test API Health
        </button>
        
        <h2>Kiểm tra Products API:</h2>
        <button onClick={async () => {
          try {
            const response = await fetch('http://localhost:5001/api/products');
            const data = await response.json();
            console.log('Products:', data);
            alert('Có ' + data.data.length + ' sản phẩm');
          } catch (error) {
            alert('Lỗi: ' + error);
          }
        }}>
          Test Products API
        </button>
      </div>
    </BrowserRouter>
  );
}

export default TestApp;
