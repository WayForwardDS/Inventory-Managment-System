import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, Layout, Menu } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { sidebarItems } from '../../constant/sidebarItems';
import { useAppDispatch } from '../../redux/hooks';
import { logoutUser } from '../../redux/services/authSlice';
import { useGetSelfProfileQuery } from '../../redux/features/authApi';
import { motion } from 'framer-motion';

const { Content, Sider } = Layout;

const Sidebar = () => {
  const [showLogoutBtn, setShowLogoutBtn] = useState(true);
  const { data } = useGetSelfProfileQuery(undefined);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    dispatch(logoutUser());
    navigate('/');
    window.location.reload();
  };

  const userRole = data?.data?.role;

  const filteredSidebarItems = sidebarItems.filter(
    (item) => !item.restriction || item.restriction.includes(userRole)
  );

  return (
    <Layout style={{ height: '100vh', background: 'transparent' }}>
      {/* Animated Background Elements */}
      <div className="absolute bg-blue-500 rounded-full w-80 h-80 opacity-40 blur-3xl top-10 left-20 animate-pulse"></div>
      <div className="absolute bg-purple-500 rounded-full w-72 h-72 opacity-40 blur-3xl bottom-10 right-20 animate-bounce"></div>

      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onCollapse={(collapsed, type) => {
          if (type === 'responsive') {
            setShowLogoutBtn(!collapsed);
          }
          if (type === 'clickTrigger') {
            setShowLogoutBtn(!collapsed);
          }
        }}
        width="220px"
        style={{
          background: 'rgba(31, 41, 55, 0.8)', // Semi-transparent dark background
          backdropFilter: 'blur(10px)', // Glassmorphism effect
          position: 'relative',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="demo-logo-vertical"
        >
             <img src={("./src/assets/LOGO.png")} width="200px"  height="auto"  style={{ display: "block", margin: "0 auto" , padding:"10px"}}  />
        </motion.div>
        <Menu
          theme="dark"
          mode="inline"
          style={{
            background: 'transparent',
            fontWeight: '700',
            borderRight: 'none',
          }}
          defaultSelectedKeys={['Dashboard']}
          items={filteredSidebarItems}
        />
        {showLogoutBtn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              margin: 'auto',
              position: 'absolute',
              bottom: 0,
              padding: '1rem',
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <Button
              type="primary"
              style={{
                width: '100%',
                background: 'linear-gradient(to right, #3b82f6, #6366f1)', // Gradient blue
                color: '#fff',
                fontWeight: 700,
                textTransform: 'uppercase',
                border: 'none',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              onClick={handleClick}
            >
              <LogoutOutlined />
              Logout
            </Button>
          </motion.div>
        )}
      </Sider>
      <Layout>
        <Content
          style={{
            padding: '2rem',
            background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)', // Gradient background
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              padding: '1rem',
              maxHeight: 'calc(100vh - 4rem)',
              minHeight: 'calc(100vh - 4rem)',
              background: 'rgba(255, 255, 255, 0.1)', // Glassmorphism effect
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              overflow: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border
            }}
          >
            <Outlet />
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;