import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAutoLogout } from '../../Hooks/useAutoLogout';
import {
  MenuFoldOutlined,
  UnorderedListOutlined,
  QuestionCircleOutlined,
  MenuUnfoldOutlined,
  PlusSquareOutlined,
  TeamOutlined,
  WarningOutlined,
  EditOutlined,
  HomeOutlined,
  LogoutOutlined,
  MoneyCollectOutlined,
  BookOutlined,
  LockOutlined,
  BellOutlined,
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
  Dropdown,
  Breadcrumb,
} from 'antd';
import userPhoto from '../../../assets/profile-picture.png';

import atuLogo from '/ATU-LOGO.png';
import { Spinner } from '@radix-ui/themes';

const { Header, Content, Footer, Sider } = Layout;

// Defining breadcrumbs links
const breadcrumbNameMap: any = {
  '/AdminDashboard/DashboardOverview': 'Dashboard',
  '/AdminDashboard/StudentsList': 'Students List',
  '/AdminDashboard/AddStudent': 'Add Student',
  '/AdminDashboard/BorrowedBooks': 'Borrowed Books',
  '/AdminDashboard/AddToList': 'Add to List',
  '/AdminDashboard/OffenseList': 'Offense List',
  '/AdminDashboard/AddOffense': 'Add Offense',
  '/AdminDashboard/PaymentList': 'Payment List',
  '/AdminDashboard/AddPayment': 'Add Payment',
  '/AdminDashboard/MyProfile': 'My Profile',
  '/AdminDashboard/EditAdminProfile': 'Edit Profile',
  '/AdminDashboard/Settings': 'Settings',
  '/AdminDashboard/Calender': 'Calendar',
  '/AdminDashboard/Notice': 'Notice',
};

const { SubMenu } = Menu;
const AdminDashboard = () => {
  useAutoLogout(); // Custom hook for auto logout
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<any>('');
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const location = useLocation(); // Get the current location

  // Convert the pathname into breadcrumb items
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return {
      title: <Link to={url}>{breadcrumbNameMap[url] || 'ATU Lorms'}</Link>,
    };
  });
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    sessionStorage.removeItem('admin'); // Clear session
    sessionStorage.clear(); // Optional: Clear everything from session storage
    navigate('/AdminLogin'); // Redirect to login page
  };

  useEffect(() => {
    const storedAdmin = sessionStorage.getItem('admin');

    if (!storedAdmin) {
      navigate('/AdminLogin'); // Redirect to login if no admin data
      return;
    }

    try {
      const adminData = JSON.parse(storedAdmin);
      setAdmin(adminData);
    } catch (error) {
      console.error('Error parsing admin data:', error);
      sessionStorage.removeItem('admin'); // Clear invalid data
      navigate('/AdminLogin'); // Redirect to login
    }

    // Fetch admin data from session storage
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  //Display Spinner component while fetching admin data
  if (!admin)
    return (
      <div>
        <Spinner />
      </div>
    );
  // Dropdown menu for avatar
  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<ProfileOutlined />}>
        <Link to="MyProfile"> Profile</Link>
      </Menu.Item>
      <Menu.Item key="EditProfile" icon={<EditOutlined />}>
        <Link to="EditAdminProfile">Edit Profile</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        onClick={handleLogout}
        key="logout"
        icon={<LogoutOutlined />}
        danger
      >
        Logout
      </Menu.Item>
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
          className={`bg-white max-md:h-full fixed border-r-[1px] border-zinc-200 ${collapsed ? 'w-0' : 'w-64'} 
    ${isMobile ? 'z-50 overflow-auto' : 'relative'} transition-all duration-300`}
          trigger={null}
          collapsible
          collapsed={collapsed}
          collapsedWidth={isMobile ? 0 : 80} // Fully hide on mobile
        >
          <Link to="DashboardOverview">
            <div className="flex items-center justify-center space-x-3 py-3 ">
              <img src={atuLogo} className="w-11 h-11" alt="ATU's Logo" />
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <h1 className="text-black cursor-pointer text-xl font-extrabold">
                    ATU Lorms
                  </h1>
                </motion.div>
              )}
            </div>
          </Link>
          <div className="demo-logo-vertical mt-2" />
          <Menu mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<DashboardOutlined />}>
              <Link to="DashboardOverview">Dashboard</Link>
            </Menu.Item>
            {/* Submenu for Students */}
            <SubMenu key="2" icon={<TeamOutlined />} title="Students">
              <Menu.Item key="Students List" icon={<TeamOutlined />}>
                <Link to="StudentsList">Students List</Link>
              </Menu.Item>
              <Menu.Item key="Add A Student" icon={<PlusSquareOutlined />}>
                <Link to="AddStudent">Add Student</Link>
              </Menu.Item>
            </SubMenu>
            {/* Submenu for Borrowed Books */}
            <SubMenu key="3" icon={<BookOutlined />} title="Borrowed Books">
              <Menu.Item key="Borrowed Books" icon={<UnorderedListOutlined />}>
                <Link to="BorrowedBooks">Borrowed Books</Link>
              </Menu.Item>
              <Menu.Item key="Add To List" icon={<PlusSquareOutlined />}>
                <Link to="AddToList">Add To List</Link>
              </Menu.Item>
            </SubMenu>
            {/* Submenu for Offenses */}
            <SubMenu
              key="4"
              icon={<ExclamationCircleOutlined />}
              title="Offenses"
            >
              <Menu.Item key="Offense List" icon={<UnorderedListOutlined />}>
                <Link to="OffenseList">Offense List</Link>
              </Menu.Item>
              <Menu.Item key="Add Offense" icon={<PlusSquareOutlined />}>
                <Link to="AddOffense">Add Offense</Link>
              </Menu.Item>
            </SubMenu>
            {/* Submenu for Payments*/}
            <SubMenu key="5" icon={<MoneyCollectOutlined />} title="Payments">
              <Menu.Item key="Payment List" icon={<UnorderedListOutlined />}>
                <Link to="PaymentList">Payment List</Link>
              </Menu.Item>
              <Menu.Item key="Add Payment" icon={<PlusSquareOutlined />}>
                <Link to="AddPayment">Add Payment</Link>
              </Menu.Item>
            </SubMenu>
            {/* Submenu for Authentication */}
            <SubMenu key="7" icon={<LockOutlined />} title="Authentication">
              <Menu.Item
                key="Logout"
                onClick={handleLogout}
                icon={<LogoutOutlined />}
              >
                <Link to="/AdminLogin">Logout</Link>
              </Menu.Item>
              <Menu.Item key="404 Page" icon={<WarningOutlined />}>
                <Link to="*">404 Page</Link>
              </Menu.Item>
              <Menu.Item
                key="Forgot Password"
                icon={<QuestionCircleOutlined />}
              >
                <Link to="/ForgotPassword">Forgot Password</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="8" icon={<CalendarOutlined />}>
              <Link to="Calender">Calender</Link>
            </Menu.Item>
            <Menu.Item key="9" icon={<BellOutlined />}>
              <Link to="Notice">Notice</Link>
            </Menu.Item>
            {/* Submenu for Profile */}
            <SubMenu
              key="11"
              className="max-md:mb-4"
              icon={<LockOutlined />}
              title="Profile"
            >
              <Menu.Item key="MyProfile" icon={<ProfileOutlined />}>
                <Link to="MyProfile">My Profile</Link>
              </Menu.Item>
              <Menu.Item key="EditProfile" icon={<EditOutlined />}>
                <Link to="EditAdminProfile">Edit Profile</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        {/* Overlay for mobile */}
        {isMobile && !collapsed && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setCollapsed(true)}
          ></div>
        )}

        {/* Main Layout */}
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              boxShadow: '0 0px 0.6px 0px',
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
              </div>
              <div className="flex items-center gap-3 pr-5">
                {/* Avatar with Dropdown */}
                <Dropdown
                  overlay={menu}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <button className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition duration-200 border-none bg-transparent">
                    <Avatar
                      src={userPhoto}
                      alt="User Icon"
                      size="large"
                      icon={<UserOutlined />}
                    />
                    <p className="text-black text-[14px]">{admin.name}</p>
                  </button>
                </Dropdown>
              </div>
            </div>
          </Header>
          <div className="flex px-5 pt-4 justify-between items-center">
            <p className="text-base text-black max-md:hidden">
              {breadcrumbNameMap[location.pathname] || 'Welcome Admin'}
            </p>
            <Breadcrumb
              items={[
                {
                  href: '/AdminDashboard/DashboardOverview',
                  title: <HomeOutlined />,
                }, // Home link
                ...breadcrumbItems, // Dynamically generated breadcrumbs
              ]}
            />
          </div>

          <Content
            style={{
              margin: '14px 16px',
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
          <Footer style={{ textAlign: 'center', minHeight: '30px' }}>
            ATU Lorms ©2025
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default AdminDashboard;
