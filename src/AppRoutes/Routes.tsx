import { Routes, Route } from 'react-router-dom';
import Registration from '../Components/Form/Registration';
import StudentLogin from '../Components/Form/StudentLogin';
import ForgotPassword from '../Components/Form/ForgotPassword';
import NotFoundPage from '../Components/NotFoundPage.tsx/NotFoundPage';
import AdminLogin from '../Components/Form/AdminLogin';

export default function AppRoute() {
  return (
    <Routes>
      <Route path="/Registration" element={<Registration />} />
      <Route path="/StudentLogin" element={<StudentLogin />} />
      <Route path="/AdminLogin" element={<AdminLogin />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
