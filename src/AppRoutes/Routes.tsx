import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy-loaded components
const Registration = lazy(() => import('../Components/Form/Registration'));
const StudentLogin = lazy(() => import('../Components/Form/StudentLogin'));
const ForgotPassword = lazy(() => import('../Components/Form/ForgotPassword'));
const NotFoundPage = lazy(
  () => import('../Components/NotFoundPage.tsx/NotFoundPage')
);
const AdminLogin = lazy(() => import('../Components/Form/AdminLogin'));
const StudentsList = lazy(
  () => import('../Components/Dashboard/AdminDashboard/StudentsList')
);
const AdminDashboard = lazy(
  () => import('../Components/Dashboard/AdminDashboard/AdminDashboard')
);
const DashboardOverview = lazy(
  () => import('../Components/Dashboard/AdminDashboard/DashboardOverview')
);
const AddStudent = lazy(
  () => import('../Components/Dashboard/AdminDashboard/AddStudent')
);
const BorrowedBooks = lazy(
  () => import('../Components/Dashboard/AdminDashboard/BorrowedBooks')
);
const AddToList = lazy(
  () => import('../Components/Dashboard/AdminDashboard/AddToList')
);
const AddOffense = lazy(
  () => import('../Components/Dashboard/AdminDashboard/AddOffense')
);
const OffenseList = lazy(
  () => import('../Components/Dashboard/AdminDashboard/OffenseList')
);
const Calender = lazy(
  () => import('../Components/Dashboard/AdminDashboard/Calender')
);
const PaymentList = lazy(
  () => import('../Components/Dashboard/AdminDashboard/PaymentList')
);
const MyProfile = lazy(
  () => import('../Components/Dashboard/AdminDashboard/MyProfile')
);
const Notice = lazy(
  () => import('../Components/Dashboard/AdminDashboard/Notice.tsx')
);
const AddPayment = lazy(
  () => import('@/Components/Dashboard/AdminDashboard/AddPayment.tsx')
);
const LandingPage = lazy(
  () => import('@/Components/LandingPage/LandingPage.tsx')
);
const EditAdminProfile = lazy(
  () => import('@/Components/Dashboard/AdminDashboard/EditAdminProfile.tsx')
);
const StudentDashboard = lazy(
  () => import('@/Components/Dashboard/StudentDashboard/StudentDashboard.tsx')
);
const StudentDashboardOverview = lazy(
  () =>
    import(
      '@/Components/Dashboard/StudentDashboard/StudentDashboardOverview.tsx'
    )
);
const StudentProfile = lazy(
  () => import('@/Components/Dashboard/StudentDashboard/StudentProfile.tsx')
);
const StudentCalender = lazy(
  () => import('@/Components/Dashboard/StudentDashboard/StudentCalender.tsx')
);
const PaymentHistory = lazy(
  () => import('@/Components/Dashboard/StudentDashboard/PaymentHistory.tsx')
);
const Notices = lazy(
  () => import('@/Components/Dashboard/StudentDashboard/Notices.tsx')
);
const Offenses = lazy(
  () => import('@/Components/Dashboard/StudentDashboard/Offenses.tsx')
);
const StudentBorrowedBooks = lazy(
  () => import('@/Components/Dashboard/StudentDashboard/BorrowedBooks.tsx')
);
const EditStudentProfile = lazy(
  () => import('@/Components/Dashboard/StudentDashboard/EditStudentProfile.tsx')
);

// Import Fallback normally (DO NOT lazy-load)
import Fallback from '@/Components/FallbackUI/Fallback.tsx';

export default function AppRoute() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/LandingPage" />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/StudentLogin" element={<StudentLogin />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />

        {/* Admin Dashboard with nested routes */}
        <Route path="/AdminDashboard" element={<AdminDashboard />}>
          <Route index element={<DashboardOverview />} />
          <Route path="DashboardOverview" element={<DashboardOverview />} />
          <Route path="StudentsList" element={<StudentsList />} />
          <Route path="Calender" element={<Calender />} />
          <Route path="PaymentList" element={<PaymentList />} />
          <Route path="Notice" element={<Notice />} />
          <Route path="OffenseList" element={<OffenseList />} />
          <Route path="EditAdminProfile" element={<EditAdminProfile />} />
          <Route path="BorrowedBooks" element={<BorrowedBooks />} />
          <Route path="AddStudent" element={<AddStudent />} />
          <Route path="MyProfile" element={<MyProfile />} />
          <Route path="AddPayment" element={<AddPayment />} />
          <Route path="AddOffense" element={<AddOffense />} />
          <Route path="AddToList" element={<AddToList />} />
        </Route>

        {/* Student Dashboard with nested routes */}
        <Route path="/StudentDashboard" element={<StudentDashboard />}>
          <Route index element={<StudentDashboardOverview />} />
          <Route
            path="StudentDashboardOverview"
            element={<StudentDashboardOverview />}
          />
          <Route path="StudentProfile" element={<StudentProfile />} />
          <Route path="BorrowedBooks" element={<StudentBorrowedBooks />} />
          <Route path="StudentCalender" element={<StudentCalender />} />
          <Route path="PaymentHistory" element={<PaymentHistory />} />
          <Route path="Notices" element={<Notices />} />
          <Route path="Offenses" element={<Offenses />} />
          <Route path="EditStudentProfile" element={<EditStudentProfile />} />
        </Route>
        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
