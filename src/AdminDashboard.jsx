import React, { useEffect, useState } from 'react';
import { Table, Button, Image, Space, message, Popconfirm, Card, Typography } from 'antd';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { DownloadOutlined, DeleteOutlined, FileZipOutlined } from '@ant-design/icons';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const { Title } = Typography;

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "user_uploads"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Tải 1 ảnh
  const downloadSingle = async (url, fileName) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      saveAs(blob, fileName);
    } catch (e) { message.error("Lỗi khi tải ảnh"); }
  };

  // TẢI TẤT CẢ (Nén ZIP)
  const downloadAll = async () => {
    if (data.length === 0) return message.warning("Không có dữ liệu để tải!");
    setDownloading(true);
    const zip = new JSZip();
    
    try {
      const promises = data.map(async (item) => {
        const response = await fetch(item.fileUrl);
        const blob = await response.blob();
        zip.file(item.fileName, blob);
      });

      await Promise.all(promises);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `DU_LIEU_CCCD_${new Date().getTime()}.zip`);
      message.success("Đã nén và tải xuống thành công!");
    } catch (error) {
      message.error("Lỗi khi nén file ZIP");
    } finally {
      setDownloading(false);
    }
  };

  // Tìm đến biến columns trong AdminDashboard.jsx và sửa lại như sau:

const columns = [
  {
    title: 'STT',
    key: 'stt',
    width: 60,
    align: 'center',
    render: (text, record, index) => (
      <span style={{ fontWeight: 'bold', color: '#8c8c8c' }}>{index + 1}</span>
    ),
  },
  { 
    title: 'HỌ VÀ TÊN', 
    render: (_, r) => <b style={{ color: '#1890ff' }}>{`${r.lastName} ${r.firstName}`}</b> 
  },
  { 
    title: 'CCCD', 
    dataIndex: 'cccd', 
    key: 'cccd' 
  },
  { 
    title: 'XEM ẢNH', 
    dataIndex: 'fileUrl', 
    render: (url) => (
      <Image 
        src={url} 
        width={80} 
        style={{ borderRadius: 4, border: '1px solid #f0f0f0' }} 
      />
    ) 
  },
  { 
    title: 'TÊN FILE', 
    dataIndex: 'fileName', 
    key: 'fileName',
    ellipsis: true, // Nếu tên file quá dài sẽ tự hiển thị dấu ...
  },
  {
    title: 'HÀNH ĐỘNG',
    align: 'center',
    render: (_, record) => (
      <Space>
        <Button 
          type="link" 
          icon={<DownloadOutlined />} 
          onClick={() => downloadSingle(record.fileUrl, record.fileName)}
        >
          Tải
        </Button>
        <Popconfirm 
          title="Xóa dữ liệu này?" 
          onConfirm={() => deleteDoc(doc(db, "user_uploads", record.id))}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
        </Popconfirm>
      </Space>
    ),
  },
];

  return (
    <div style={{ padding: '30px' }}>
      <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Title level={3}>DANH SÁCH THÔNG TIN ĐÃ GỬI</Title>
          <Button 
            type="primary" 
            danger={true}
            icon={<FileZipOutlined />} 
            onClick={downloadAll} 
            loading={downloading}
            size="large"
          >
            TẢI TẤT CẢ (ZIP)
          </Button>
        </div>
        
        <Table 
          dataSource={data} 
          columns={columns} 
          rowKey="id" 
          loading={loading} 
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;