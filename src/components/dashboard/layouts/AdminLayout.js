// src/components/dashboard/layouts/AdminLayout.js
import React, { useState } from 'react';
import { Layout, Menu, Avatar } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Sider, Header, Content, Footer } = Layout;

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Tableau de bord' },
  { key: '/dashboard/users', icon: <UserOutlined />, label: 'Utilisateurs' },
  { key: '/dashboard/products', icon: <AppstoreOutlined />, label: 'Produits' },
  { key: '/dashboard/orders', icon: <ShoppingCartOutlined />, label: 'Commandes' },
  { key: '/dashboard/settings', icon: <SettingOutlined />, label: 'Paramètres' },
];

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={200} breakpoint="lg">
        <div
          style={{
            height: 48,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 20,
            textAlign: 'center',
            lineHeight: '48px',
            cursor: 'default',
            userSelect: 'none',
          }}
        >
          Fasofarm
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems.map(({ key, icon, label }) => ({
            key,
            icon,
            label: <Link to={key}>{label}</Link>,
          }))}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Avatar size={40} src="/admin/avatar.jpg" alt="Admin" />
        </div>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 20px', borderBottom: '1px solid #e8e8e8' }}>
          <h1 style={{ margin: 0, fontWeight: 500 }}>Tableau de bord Admin</h1>
        </Header>
        <Content style={{ margin: 24, background: '#fff', padding: 24, minHeight: 360 }}>
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>©2025 Fasofarm - Admin</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
