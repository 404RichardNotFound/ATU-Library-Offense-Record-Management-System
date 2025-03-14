import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  HomeOutlined,
  LogoutOutlined,
  MoneyCollectOutlined,
  BookOutlined,
  UserAddOutlined,
  LockOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  ProfileOutlined,
  DashboardOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { motion } from 'motion/react';
import {
  Button,
  Avatar,
  Layout,
  Menu,
  theme,
  Badge,
  AutoComplete,
  Dropdown,
  Input,
  Breadcrumb,
} from 'antd';
import userPhoto from '../../../assets/woman-photo.jpg';

import atuLogo from '/ATU-LOGO.png';

const { Header, Content, Footer, Sider } = Layout;

const { SubMenu } = Menu;
const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New student registered', read: false },
    { id: 2, message: 'System update available', read: false },
    { id: 3, message: 'New offense reported', read: true },
  ]);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Dropdown menu for avatar
  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<ProfileOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        Logout
      </Menu.Item>
    </Menu>
  );

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  // Dropdown menu for notifications
  const notificationMenu = (
    <Menu>
      {notifications.length > 0 ? (
        <>
          <div className="py-2 gap-2 flex justify-center">
            {<BellOutlined />}
            <p className="text-center">Notifications</p>
          </div>
          <hr />
          {notifications.map((notif) => (
            <Menu.Item
              key={notif.id}
              className={notif.read ? 'text-gray-500' : 'font-bold'}
              icon={<UserAddOutlined />}
            >
              {notif.message}
            </Menu.Item>
          ))}
          <Menu.Divider />
          <Menu.Item
            onClick={markAllAsRead}
            className="text-center text-blue-500"
          >
            Mark all as read
          </Menu.Item>
        </>
      ) : (
        <Menu.Item className="text-center">No new notifications</Menu.Item>
      )}
    </Menu>
  );

  return (
    <div>
      <Layout
        style={{
          minHeight: '100vh',
        }}
      >
        <Sider
          trigger={null}
          className="bg-white"
          collapsible
          collapsed={collapsed}
        >
          <div className="flex items-center justify-center space-x-3 py-3 ">
            <img src={atuLogo} className="w-11 h-11" alt="ATU's Logo" />
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <h1 className="text-black text-xl font-extrabold">ATU Lorms</h1>
              </motion.div>
            )}
          </div>
          <div className="demo-logo-vertical mt-2" />
          <Menu mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item
              key="1"
              icon={<DashboardOutlined style={{ color: '' }} />}
            >
              <Link to="DashboardOverview">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<TeamOutlined />}>
              <Link to="Students">Students</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<BookOutlined />}>
              Borrowed Books
            </Menu.Item>
            <Menu.Item key="4" icon={<ExclamationCircleOutlined />}>
              <Link to="Offenses">Offenses</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<MoneyCollectOutlined />}>
              Payments
            </Menu.Item>
            {/* Submenu for Authentication */}
            <SubMenu key="6" icon={<LockOutlined />} title="Authentication">
              <Menu.Item
                key="logout"
                icon={<LogoutOutlined />}
                onClick={() => alert('Logging out...')}
              >
                Logout
              </Menu.Item>
              <Menu.Item
                key="logout"
                icon={<LogoutOutlined />}
                onClick={() => alert('Logging out...')}
              >
                404 Page
              </Menu.Item>
              <Menu.Item
                key="logout"
                icon={<LogoutOutlined />}
                onClick={() => alert('Logging out...')}
              >
                Forgot Password
              </Menu.Item>
            </SubMenu>

            <Menu.Item key="7" icon={<CalendarOutlined />}>
              Calender
            </Menu.Item>
            <Menu.Item key="8" icon={<BellOutlined />}>
              Notifications
            </Menu.Item>
            <Menu.Item key="9" icon={<ProfileOutlined />}>
              <Link to="AdminProfile">Profile</Link>
            </Menu.Item>
            <Menu.Item key="10" icon={<SettingOutlined />}>
              Settings
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <div className="flex justify-between w-full h-full">
              <div className="flex items-center">
                <Button
                  type="text"
                  icon={
                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: '18px',
                    width: 64,
                    height: 64,
                  }}
                />
                <AutoComplete
                  popupMatchSelectWidth={252}
                  style={{ width: 220 }}
                  size="middle"
                  className="max-md:hidden"
                >
                  <Input.Search
                    style={{}}
                    size="middle"
                    placeholder="search"
                    enterButton
                  />
                </AutoComplete>
              </div>
              <div className="flex items-center gap-3 pr-5">
                {/* Notification Icon & Avatar */}
                <div className="flex items-center space-x-4">
                  {/* Notification Dropdown */}
                  <Dropdown
                    overlay={notificationMenu}
                    trigger={['click']}
                    placement="bottomRight"
                  >
                    <Badge
                      count={notifications.filter((n) => !n.read).length}
                      size="small"
                    >
                      <Button
                        type="text"
                        size="large"
                        icon={<BellOutlined style={{ fontSize: '20px' }} />}
                      />
                    </Badge>
                  </Dropdown>
                </div>
                {/* Avatar with Dropdown */}
                <Dropdown
                  overlay={menu}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <button className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition duration-200 border-none bg-transparent">
                    <Avatar
                      src={userPhoto}
                      size="default"
                      icon={<UserOutlined />}
                    />
                    <p className="text-black max-md:hidden text-md ">
                      Jessica Davidson
                    </p>
                  </button>
                </Dropdown>
              </div>
            </div>
          </Header>
          <div className="flex px-5 pt-4 justify-between items-center">
            <p className="text-lg text-black opacity-40  max-md:hidden">
              Welcome Admin!
            </p>
            <Breadcrumb
              style={{
                fontSize: '16px',
              }}
              items={[
                {
                  href: '',
                  title: <HomeOutlined />,
                },
                {
                  href: '',
                  title: <span>Dashboard</span>,
                },
              ]}
            />
          </div>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
          <Footer style={{ textAlign: 'center', minHeight: '30px' }}>
            ATU Lorms ©2025 Created by ATU Management
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default AdminDashboard;
