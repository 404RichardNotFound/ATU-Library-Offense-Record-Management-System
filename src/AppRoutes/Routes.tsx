import { Routes, Route, Navigate } from 'react-router-dom';
import Registration from '../Components/Form/Registration';
import StudentLogin from '../Components/Form/StudentLogin';
import ForgotPassword from '../Components/Form/ForgotPassword';
import NotFoundPage from '../Components/NotFoundPage.tsx/NotFoundPage';
import AdminLogin from '../Components/Form/AdminLogin';
import Students from '../Components/Dashboard/AdminDashboard/Students';
import Offenses from '../Components/Dashboard/AdminDashboard/Offenses';
import AdminDashboard from '../Components/Dashboard/AdminDashboard/AdminDashboard';
import DashboardOverview from '../Components/Dashboard/AdminDashboard/DashboardOverview';
import AdminProfile from '../Components/Dashboard/AdminDashboard/AdminProfile';
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
        <Route path="Students" element={<Students />} />
        <Route path="Offenses" element={<Offenses />} />
        <Route path="AdminProfile" element={<AdminProfile />} />
      </Route>
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
