import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStudentAutoLogout } from '../../Hooks/useStudentAutoLogout';
import {
  MenuFoldOutlined,
  QuestionCircleOutlined,
  MenuUnfoldOutlined,
  WarningOutlined,
  EditOutlined,
  MoneyCollectOutlined,
  BookOutlined,
  HomeOutlined,
  LogoutOutlined,
  LockOutlined,
  BellOutlined,
  UserOutlined,
  ProfileOutlined,
  DashboardOutlined,
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

import atuLogo from '/ATU-LOGO.png';
import { Spinner } from '@radix-ui/themes';

const { Header, Content, Footer, Sider } = Layout;

// Defining breadcrumbs links
const breadcrumbNameMap: any = {
  '/StudentDashboard/StudentDashboardOverview': 'Dashboard',
  '/StudentDashboard/StudentEditProfile': 'Edit Profile',
  '/StudentDashboard/StudentProfile': 'My Profile',
  '/StudentDashboard/BorrowedBooks': 'Borrowed Books',
  '/StudentDashboard/PaymentHistory': 'Payment History',
  '/StudentDashboard/Offenses': 'Offenses',
  '/StudentDashboard/StudentCalender': 'Calendar',
  '/StudentDashboard/Notices': 'Notices',
  '/StudentDashboard/MyProfile': 'My Profile',
  '/StudentDashboard/EditStudentProfile': 'Edit Profile',
};

const { SubMenu } = Menu;
const StudentDashboard = () => {
  // Auto logout hook
  useStudentAutoLogout();
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>('');
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const location = useLocation(); // Get the current location

  // Convert the pathname into breadcrumb items
  const pathSnippets = location.pathname.split('.').filter((i) => i);
  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `${pathSnippets.slice(0, index + 1).join('/')}`;
    return {
      title: <Link to={url}>{breadcrumbNameMap[url]}</Link>,
    };
  });
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    const id = sessionStorage.getItem('activeStudentId');

    if (id) {
      sessionStorage.removeItem(`student_${id}`);
      sessionStorage.removeItem('activeStudentId');
    }

    navigate('/StudentLogin');
  };

  useEffect(() => {
    const id = sessionStorage.getItem('activeStudentId');

    if (!id) {
      navigate('/StudentLogin');
      return;
    }

    const stored = sessionStorage.getItem(`student_${id}`);
    if (!stored) {
      navigate('/StudentLogin');
      return;
    }

    try {
      const student = JSON.parse(stored);
      setStudent(student);
    } catch (err) {
      sessionStorage.removeItem(`student_${id}`);
      navigate('/StudentLogin');
    }

    // Fetch student data from session storage
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  //Display Spinner component while fetching student data
  if (!student)
    return (
      <div>
        <Spinner />
      </div>
    );
  // Dropdown menu for avatar
  const menu = (
    <Menu>
      <Menu.Item key="StudentProfile" icon={<ProfileOutlined />}>
        <Link to="StudentProfile"> Profile</Link>
      </Menu.Item>
      <Menu.Item key="EditStudentProfile" icon={<EditOutlined />}>
        <Link to="EditStudentProfile">Edit Profile</Link>
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
          className={`bg-white max-md:h-full fixed border-r-[1px] border-neutral-300 ${collapsed ? 'w-0' : 'w-64'} 
    ${isMobile ? 'z-50 overflow-auto' : 'relative'} transition-all duration-300`}
          trigger={null}
          collapsible
          collapsed={collapsed}
          collapsedWidth={isMobile ? 0 : 80} // Fully hide on mobile
        >
          <Link to="StudentDashboardOverview">
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
              <Link to="StudentDashboardOverview">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<BookOutlined />}>
              <Link to="BorrowedBooks">Borrowed Books</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<WarningOutlined />}>
              <Link to="Offenses">Offenses</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<MoneyCollectOutlined />}>
              <Link to="PaymentHistory">Payment History</Link>
            </Menu.Item>
            {/* Submenu for Authentication */}
            <SubMenu key="5" icon={<LockOutlined />} title="Authentication">
              <Menu.Item
                key="Logout"
                onClick={handleLogout}
                icon={<LogoutOutlined />}
              >
                <Link to="/StudentLogin">Logout</Link>
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
            <Menu.Item key="6" icon={<CalendarOutlined />}>
              <Link to="StudentCalender">Calender</Link>
            </Menu.Item>
            <Menu.Item key="7" icon={<BellOutlined />}>
              <Link to="Notices">Notices</Link>
            </Menu.Item>
            {/* Submenu for Profile */}
            <SubMenu
              key="8"
              className="max-md:mb-4"
              icon={<LockOutlined />}
              title="Profile"
            >
              <Menu.Item key="StudentProfile" icon={<ProfileOutlined />}>
                <Link to="StudentProfile">My Profile</Link>
              </Menu.Item>
              <Menu.Item key="EditStudentProfile" icon={<EditOutlined />}>
                <Link to="EditStudentProfile">Edit Profile</Link>
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
              boxShadow: '0 0px 0.7px 0px',
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
                      src={student.profileImage}
                      alt="User Icon"
                      size="default"
                      icon={<UserOutlined />}
                    />
                    <p className="text-black text-[14px]">{student.Name}</p>
                  </button>
                </Dropdown>
              </div>
            </div>
          </Header>
          <div className="flex px-5 pt-4 justify-between items-center">
            <p className="text-base text-black max-md:hidden">
              {`Welcome Student`}
            </p>
            <Breadcrumb
              items={[
                {
                  href: '/StudentDashboard/StudentDashboardOverview',
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

export default StudentDashboard;
