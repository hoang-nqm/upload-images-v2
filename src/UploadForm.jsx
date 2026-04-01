import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Card, Typography, Space } from 'antd';
import { CloudUploadOutlined, UserOutlined, IdcardOutlined } from '@ant-design/icons';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const { Title, Text } = Typography;

const UploadForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const CLOUD_NAME = "dz8vaxlx0"; 
  const UPLOAD_PRESET = "upload_images_v2"; // Nhớ thay preset của bạn

  const onFinish = async (values) => {
  if (fileList.length === 0) return message.error("Vui lòng chọn ảnh!");

  const fileObj = fileList[0].originFileObj || fileList[0];
  setLoading(true);

  try {
    const firstName = values.firstName.toUpperCase().trim();
    const lastName = values.lastName.toUpperCase().trim();
    const cccd = values.cccd.trim();
    
    const extension = fileObj.name.split('.').pop();
    const dateFolder = new Date().toISOString().split('T')[0];
    
    // Tên chuẩn bạn muốn (Dùng để tải về)
    const baseFileName = `${firstName} + ${lastName}_${cccd}`;

    // Tên định danh DUY NHẤT để gửi lên Cloudinary (Thêm timestamp để tránh lỗi Overwrite)
    const uniquePublicId = `${baseFileName}_${Date.now()}`;

    const formData = new FormData();
    formData.append("file", fileObj);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("public_id", uniquePublicId); // Gửi tên có timestamp
    formData.append("folder", `uploads/${dateFolder}`);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData
    });
    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    // LƯU VÀO FIRESTORE
    await addDoc(collection(db, "user_uploads"), {
      firstName,
      lastName,
      cccd,
      fileName: `${baseFileName}.${extension}`, // Lưu tên CHUẨN (không có timestamp)
      fileUrl: data.secure_url, // Link ảnh mới nhất
      createdAt: serverTimestamp(),
    });

    message.success("Gửi thông tin thành công!");
    form.resetFields();
    setFileList([]);
  } catch (error) {
    message.error("Lỗi: " + error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      minHeight: 'calc(100vh - 64px)', padding: '20px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' 
    }}>
      <Card bordered={false} style={{ width: 500, borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: 5 }}>THÔNG TIN ĐĂNG KÝ</Title>
          <Text type="secondary">Vui lòng nhập đúng thông tin trên CCCD</Text>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} size="large">
          <Form.Item label="TÊN" name="firstName" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input prefix={<UserOutlined style={{color: '#bfbfbf'}} />} placeholder="VD: HOÀNG" />
          </Form.Item>

          <Form.Item label="HỌ VÀ TÊN LÓT " name="lastName" rules={[{ required: true, message: 'Vui lòng nhập họ lót!' }]}>
            <Input prefix={<UserOutlined style={{color: '#bfbfbf'}} />} placeholder="VD: NGUYỄN QUANG MINH" />
          </Form.Item>

          <Form.Item 
            label="SỐ CCCD" name="cccd" 
            rules={[{ required: true, pattern: /^\d{12}$/, message: 'CCCD phải đúng 12 số!' }]}
          >
            <Input prefix={<IdcardOutlined style={{color: '#bfbfbf'}} />} placeholder="12 chữ số" maxLength={12} />
          </Form.Item>

          <Form.Item label="ẢNH CHỤP FACEID">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onRemove={() => setFileList([])}
              beforeUpload={(file) => { setFileList([file]); return false; }}
              maxCount={1}
            >
              {fileList.length < 1 && (
                <div>
                  <CloudUploadOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading} style={{ height: '50px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>
            XÁC NHẬN VÀ TẢI LÊN
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default UploadForm;