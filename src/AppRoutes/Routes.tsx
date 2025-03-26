import { Routes, Route, Navigate } from 'react-router-dom';
import Registration from '../Components/Form/Registration';
import StudentLogin from '../Components/Form/StudentLogin';
import ForgotPassword from '../Components/Form/ForgotPassword';
import NotFoundPage from '../Components/NotFoundPage.tsx/NotFoundPage';
import AdminLogin from '../Components/Form/AdminLogin';
import StudentsList from '../Components/Dashboard/AdminDashboard/StudentsList';
import Offenses from '../Components/Dashboard/AdminDashboard/Offenses';
import AdminDashboard from '../Components/Dashboard/AdminDashboard/AdminDashboard';
import DashboardOverview from '../Components/Dashboard/AdminDashboard/DashboardOverview';
import AdminProfile from '../Components/Dashboard/AdminDashboard/AdminProfile';
import AddStudent from '../Components/Dashboard/AdminDashboard/AddStudent';
import BorrowedBooks from '../Components/Dashboard/AdminDashboard/BorrowedBooks';
import AddToList from '../Components/Dashboard/AdminDashboard/AddToList';
import AddOffense from '../Components/Dashboard/AdminDashboard/AddOffense';
import OffenseList from '../Components/Dashboard/AdminDashboard/OffenseList';
import Calender from '../Components/Dashboard/AdminDashboard/Calender';
import PaymentList from '../Components/Dashboard/AdminDashboard/PaymentList';
import MyProfile from '../Components/Dashboard/AdminDashboard/MyProfile';
import Notice from '../Components/Dashboard/AdminDashboard/Notice.tsx';

export default function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/StudentLogin" />} />
      <Route path="/Registration" element={<Registration />} />
      <Route path="/StudentLogin" element={<StudentLogin />} />
      <Route path="/AdminLogin" element={<AdminLogin />} />
      <Route path="/AdminDashboard" element={<AdminDashboard />}>
        <Route index element={<DashboardOverview />} />
        <Route path="DashboardOverview" element={<DashboardOverview />} />
        <Route path="StudentsList" element={<StudentsList />} />
        <Route path="Offenses" element={<Offenses />} />
        <Route path="Calender" element={<Calender />} />
        <Route path="AdminProfile" element={<AdminProfile />} />
        <Route path="PaymentList" element={<PaymentList />} />
        <Route path="Notice" element={<Notice />} />
        <Route path="OffenseList" element={<OffenseList />} />
        <Route path="BorrowedBooks" element={<BorrowedBooks />} />
        <Route path="AddStudent" element={<AddStudent />} />
        <Route path="MyProfile" element={<MyProfile />} />
        <Route path="AddOffense" element={<AddOffense />} />
        <Route path="AddToList" element={<AddToList />} />
      </Route>
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
