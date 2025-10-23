import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Check if already logged in
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log("Attempting login with:", {
        username: values.username,
        passwordLength: values.password?.length || 0
      });

      // Try the normal login endpoint
      const response = await fetch('https://192.168.0.252:3000/maintenance/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ten_dang_nhap: values.username,
          mat_khau: values.password
        }),
      });
      
      console.log("Login response status:", response.status);
      const result = await response.json();
      console.log("Login response:", result);
      
      if (response.ok && result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('userData', JSON.stringify(result.data || {}));
        
        notification.success({ 
          message: 'Đăng nhập thành công!', 
          description: result.message || 'Đăng nhập thành công', 
          duration: 2 
        });
        
        navigate('/');
        return;
      }
      
      // If login endpoint fails, try manual login with account list
      console.log("Auth login failed, trying fallback...");
      
      const accountsResponse = await fetch('https://192.168.0.252:3000/maintenance/accounts', {
        method: 'GET'
      });
      
      const accountsData = await accountsResponse.json();
      
      if (accountsResponse.ok && accountsData.success) {
        const user = accountsData.data.find(account => 
          account.ten_dang_nhap === values.username && 
          account.mat_khau === values.password
        );
        
        if (user) {
          localStorage.setItem('token', 'manual-token-' + Math.random());
          localStorage.setItem('userData', JSON.stringify(user));
          
          notification.success({ 
            message: 'Đăng nhập thành công!', 
            description: 'Đăng nhập bằng phương pháp dự phòng', 
            duration: 2 
          });
          
          navigate('/');
          return;
        }
      }
      
      throw new Error(result.message || 'Tên đăng nhập hoặc mật khẩu không chính xác');
    } catch (error) {
      console.error("Login error:", error);
      notification.error({ 
        message: 'Đăng nhập thất bại', 
        description: error.message, 
        duration: 3 
      });
    } finally {
      setLoading(false);
    }
  };

  const transparentStyle = { background: 'transparent', border: 'none', color: '#fff', boxShadow: 'none' };
  const formStyle = { background: 'transparent', padding: '40px', borderRadius: '12px', width: '450px', textAlign: 'center' };

  return (
    <div className="login-wrapper">
      <div className="login-container" style={formStyle}>
        <h2 className="login-title">Welcome Back!</h2>
        <Form name="login_form" onFinish={onFinish} className="login-form">
          <Form.Item name="username" rules={[{ required: true, message: 'Username required!' }]}>
            <Input 
              prefix={<UserOutlined style={{ color: 'white' }} />} 
              placeholder="Username" 
              className="login-input" 
            />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Password required!' }]}>
            <Input.Password 
              prefix={<LockOutlined style={{ color: 'white' }} />} 
              placeholder="Password" 
              className="login-input" 
            />
          </Form.Item>
          <Form.Item className="checkbox-item">
            <Checkbox style={{ color: '#fff' }}>Remember me</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              className="login-button" 
              style={transparentStyle}
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;