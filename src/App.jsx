import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import UploadForm from './UploadForm';
import AdminDashboard from './AdminDashboard';
import { Layout, Typography } from 'antd';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header - Thanh menu trên cùng */}
        <Header style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          background: '#001529',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%'
        }}>
          <Link to="/" style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px' }}>
            HỆ THỐNG CẬP NHẬT THÔNG TIN FACEID
          </Link>
        </Header>
        
        {/* Content - Nội dung chính của các trang */}
        <Content style={{ flex: 1, background: '#f0f2f5' }}>
          <Routes>
            <Route path="/" element={<UploadForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Content>

        {/* Footer - Dòng bản quyền bạn muốn thêm */}
        <Footer style={{ 
          textAlign: 'center', 
          background: '#f0f2f5', 
          padding: '20px 0',
          borderTop: '1px solid #e8e8e8'
        }}>
          <Text type="secondary" style={{ fontSize: '14px', letterSpacing: '0.5px' }}>
            © {new Date().getFullYear()} - <span style={{ fontWeight: '500' }}>Copyright by hoangnqm</span>
          </Text>
        </Footer>
      </Layout>
    </BrowserRouter>
  );
}

export default App;