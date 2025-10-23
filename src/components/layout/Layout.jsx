import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { Layout, Menu, Breadcrumb, Avatar } from 'antd';
import { DesktopOutlined, FileOutlined, UserOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { FlashAuto } from '@material-ui/icons';

import './layout.css';

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

function LayoutApp(props) {
  const { children } = props;
  const navigation = useNavigate();
  const [current, setCurrent] = useState('mail');

  let keyMenu;
  let tmp = window.location.pathname;
  let tmpArr = tmp.split('/');
  keyMenu = `/${tmpArr[1]}`;

  const handleClick = (event) => {
    setCurrent(event.key);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigation('/');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="site-layout-background" style={{ padding: 0, position: 'sticky', top: 0, zIndex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 20px',
          }}
        >
          <div className="logo" style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
            <a href="https://hoangphucthanh.vn/" style={{ color: '#fff', textDecoration: 'none' }}>
              HOPT
            </a>
          </div>

          {/* Menu điều hướng và nút Log out */}
          <Menu
            onClick={handleClick}
            selectedKeys={[current]}
            mode="horizontal"
            style={{ background: 'transparent', borderBottom: 'none', color: '#fff' }}
            className="header-menu"
          >
            <Menu.Item key="/" icon={<HomeOutlined style={{ color: '#fff' }} />}>
              <NavLink to="/" style={{ color: '#fff' }}>Trang Chủ</NavLink>
            </Menu.Item>


            {/* Submenu Chẩn đoán */}

            <SubMenu
              key="canlam"
              icon={<FileOutlined style={{ color: '#fff' }} />}
              title={<span style={{ color: '#fff' }}>Cận lâm sàng</span>}
              onTitleClick={() => navigation('/canlam')}
            >
              <Menu.Item key="/canlam/xetnghiem">
                <NavLink to="/canlam/xetnghiem" style={{ color: '#000' }}>🧪 Xét nghiệm</NavLink>
              </Menu.Item>
              <Menu.Item key="/canlam/sieuam">
                <NavLink to="/canlam/sieuam" style={{ color: '#000' }}>🩻 Siêu âm</NavLink>
              </Menu.Item>
              <Menu.Item key="/canlam/noisoi">
                <NavLink to="/canlam/noisoi" style={{ color: '#000' }}>🔬 Nội soi</NavLink>
              </Menu.Item>
              <Menu.Item key="/canlam/xquang">
                <NavLink to="/canlam/xquang" style={{ color: '#000' }}>🖼️ X-Quang</NavLink>
              </Menu.Item>
              <Menu.Item key="/canlam/ct">
                <NavLink to="/canlam/ct" style={{ color: '#000' }}>🖥️ CT</NavLink>
              </Menu.Item>
              <Menu.Item key="/canlam/mri">
                <NavLink to="/canlam/mri" style={{ color: '#000' }}>🧲 MRI</NavLink>
              </Menu.Item>
              <Menu.Item key="/canlam/ecg">
                <NavLink to="/canlam/ecg" style={{ color: '#000' }}>❤️ Điện tim (ECG)</NavLink>
              </Menu.Item>
              <Menu.Item key="/canlam/thuthuat">
                <NavLink to="/canlam/thuthuat" style={{ color: '#000' }}>🩺 Thủ thuật</NavLink>
              </Menu.Item>
              <Menu.Item key="/canlam/phauthuat">
                <NavLink to="/canlam/phauthuat" style={{ color: '#000' }}>🏥 Phẫu thuật</NavLink>
              </Menu.Item>
              <Menu.Item key="/canlam/xuongkhop">
                <NavLink to="/canlam/xuongkhop" style={{ color: '#000' }}>🔖 Xương khớp</NavLink>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="/admin/users" icon={<SettingOutlined style={{ color: '#fff' }} />}>
              <NavLink to="/admin/users" style={{ color: '#fff' }}>Quản trị</NavLink>
            </Menu.Item>



            {/* Nút Log out */}
            <SubMenu
              key="SubMenu"
              icon={
                <IconButton aria-label="settings" onClick={handleClick}>
                  <Avatar size="large" icon={<UserOutlined />} />
                </IconButton>
              }
              style={{ background: 'none !important' }}
            >
              <Menu.Item key="setting:1" onClick={handleLogout} style={{ color: '#000' }}>
                Log out
              </Menu.Item>
            </SubMenu>
          </Menu>
        </div>
      </Header>
      <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '8px 0', color: '#fff' }}>
            <Breadcrumb.Item> </Breadcrumb.Item>
            <Breadcrumb.Item></Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <h3>TELEMEDICINE</h3>
        </Footer>
      </Layout>
    </Layout>
  );
}

export default LayoutApp;