import {
  Route,
  Routes,
} from "react-router";

/* LAYOUTS */
import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/layout/AdminLayout";
import TrainerLayout from "../components/layout/TrainerLayout";
import CollegeLayout from "../components/layout/CollegeLayout";
import StudentLayout from "../components/layout/StudentLayout";

/* PUBLIC */
import HomePage from "../pages/public/HomePage";
import AboutPage from "../pages/public/AboutPage";
import ServicesPage from "../pages/public/ServicesPage";
import TrainersPage from "../pages/public/TrainersPage";
import TrainerDetailsPage from "../pages/public/TrainerDetailsPage";
import InstitutionsPage from "../pages/public/InstitutionsPage";
import RequestGuestFacultyPage from "../pages/public/RequestGuestFacultyPage";
import ContactPage from "../pages/public/ContactPage";
import LoginPage from "../pages/public/LoginPage";

/* AUTH */
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import RegistrationSuccessPage from "../pages/auth/RegistrationSuccessPage";
import UnauthorizedPage from "../pages/auth/UnauthorizedPage";

/* ADMIN */
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AnalyticsPage from "../pages/admin/AnalyticsPage";
import DemoSchedulesPage from "../pages/admin/DemoSchedulesPage";
import FeedbackPage from "../pages/admin/FeedbackPage";
import ManageCollegesPage from "../pages/admin/ManageCollegesPage";
import ManageRequestsPage from "../pages/admin/ManageRequestsPage";
import ManageTrainersPage from "../pages/admin/ManageTrainersPage";
import NotificationsPage from "../pages/admin/NotificationsPage";
import PaymentsPage from "../pages/admin/PaymentsPage";
import AdminTrainerAssignmentsPage from "../pages/admin/TrainerAssignmentsPage";

/* TRAINER */
import TrainerDashboardPage from "../pages/trainer/TrainerDashboardPage";
import TrainerProfilePage from "../pages/trainer/TrainerProfilePage";
import TrainerAvailabilityPage from "../pages/trainer/TrainerAvailabilityPage";
import TrainerAssignmentsPage from "../pages/trainer/TrainerAssignmentsPage";
import TrainerSchedulePage from "../pages/trainer/TrainerSchedulePage";
import TrainerNotificationsPage from "../pages/trainer/TrainerNotificationsPage";
import TrainerPaymentsPage from "../pages/trainer/TrainerPaymentsPage";

/* COLLEGE */
import CollegeDashboardPage from "../pages/college/CollegeDashboardPage";
import CollegeProfilePage from "../pages/college/CollegeProfilePage";
import FindTrainersPage from "../pages/college/FindTrainersPage";
import CollegeRequestsPage from "../pages/college/CollegeRequestsPage";
import CollegeAssignmentsPage from "../pages/college/CollegeAssignmentsPage";
import DemoSchedulePage from "../pages/college/DemoSchedulePage";
import CollegeNotificationsPage from "../pages/college/CollegeNotificationsPage";
import CollegePaymentsPage from "../pages/college/CollegePaymentsPage";
import CollegeFeedbackPage from "../pages/college/CollegeFeedbackPage";

/* STUDENT */
import StudentDashboardPage from "../pages/student/StudentDashboardPage";
import StudentProfilePage from "../pages/student/StudentProfilePage";
import MyCoursesPage from "../pages/student/MyCoursesPage";
import CourseDetailsPage from "../pages/student/CourseDetailsPage";
import LiveClassesPage from "../pages/student/LiveClassesPage";
import SchedulePage from "../pages/student/SchedulePage";
import AssignmentsPage from "../pages/student/AssignmentsPage";
import AssignmentDetailsPage from "../pages/student/AssignmentDetailsPage";
import CodingTestsPage from "../pages/student/CodingTestsPage";
import TestDetailsPage from "../pages/student/TestDetailsPage";
import TestResultPage from "../pages/student/TestResultPage";
import ProgressPage from "../pages/student/ProgressPage";
import ResultsPage from "../pages/student/ResultsPage";
import CertificatesPage from "../pages/student/CertificatesPage";
import StudentNotificationsPage from "../pages/student/NotificationsPage";
import ResourcesPage from "../pages/student/ResourcesPage";
import SupportPage from "../pages/student/SupportPage";
import SettingsPage from "../pages/student/SettingsPage";

import NotFoundPage from "../pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC */}

      <Route element={<MainLayout />}>

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/about"
          element={<AboutPage />}
        />

        <Route
          path="/services"
          element={<ServicesPage />}
        />

        <Route
          path="/trainers"
          element={<TrainersPage />}
        />

        <Route
          path="/trainers/:trainerId"
          element={<TrainerDetailsPage />}
        />

        <Route
          path="/institutions"
          element={<InstitutionsPage />}
        />

        <Route
          path="/request-guest-faculty"
          element={<RequestGuestFacultyPage />}
        />

        <Route
          path="/contact"
          element={<ContactPage />}
        />

      </Route>


      <Route
        path="/login"
        element={<LoginPage />}
      />



      {/* AUTHENTICATION */}

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />

      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />

      <Route
        path="/verify-email"
        element={<VerifyEmailPage />}
      />

      <Route
        path="/registration-success"
        element={<RegistrationSuccessPage />}
      />

      <Route
        path="/unauthorized"
        element={<UnauthorizedPage />}
      />

      {/* ADMIN */}

      <Route
        path="/admin"
        element={<AdminLayout />}
      >

        <Route
          index
          element={<AdminDashboardPage />}
        />

        <Route
          path="trainers"
          element={<ManageTrainersPage />}
        />

        <Route
          path="colleges"
          element={<ManageCollegesPage />}
        />

        <Route
          path="requests"
          element={<ManageRequestsPage />}
        />

        <Route
          path="assignments"
          element={<AdminTrainerAssignmentsPage />}
        />

        <Route
          path="demos"
          element={<DemoSchedulesPage />}
        />

        <Route
          path="notifications"
          element={<NotificationsPage />}
        />

        <Route
          path="payments"
          element={<PaymentsPage />}
        />

        <Route
          path="feedback"
          element={<FeedbackPage />}
        />

        <Route
          path="analytics"
          element={<AnalyticsPage />}
        />

      </Route>


      {/* TRAINER */}

      <Route
        path="/trainer"
        element={<TrainerLayout />}
      >

        <Route
          index
          element={<TrainerDashboardPage />}
        />

        <Route
          path="profile"
          element={<TrainerProfilePage />}
        />

        <Route
          path="availability"
          element={<TrainerAvailabilityPage />}
        />

        <Route
          path="assignments"
          element={<TrainerAssignmentsPage />}
        />

        <Route
          path="schedule"
          element={<TrainerSchedulePage />}
        />

        <Route
          path="notifications"
          element={<TrainerNotificationsPage />}
        />

        <Route
          path="payments"
          element={<TrainerPaymentsPage />}
        />

      </Route>


      {/* COLLEGE */}

      <Route
        path="/college"
        element={<CollegeLayout />}
      >

        <Route
          index
          element={<CollegeDashboardPage />}
        />

        <Route
          path="profile"
          element={<CollegeProfilePage />}
        />

        <Route
          path="trainers"
          element={<FindTrainersPage />}
        />

        <Route
          path="requests"
          element={<CollegeRequestsPage />}
        />

        <Route
          path="assignments"
          element={<CollegeAssignmentsPage />}
        />

        <Route
          path="demo-schedule"
          element={<DemoSchedulePage />}
        />

        <Route
          path="notifications"
          element={<CollegeNotificationsPage />}
        />

        <Route
          path="payments"
          element={<CollegePaymentsPage />}
        />

        <Route
          path="feedback"
          element={<CollegeFeedbackPage />}
        />

      </Route>


      {/* ==================================
          STUDENT PANEL - LIGHT THEME
      =================================== */}

      <Route
        path="/student"
        element={<StudentLayout />}
      >

        <Route
          index
          element={<StudentDashboardPage />}
        />

        <Route
          path="profile"
          element={<StudentProfilePage />}
        />

        <Route
          path="courses"
          element={<MyCoursesPage />}
        />

        <Route
          path="courses/:courseId"
          element={<CourseDetailsPage />}
        />

        <Route
          path="live-classes"
          element={<LiveClassesPage />}
        />

        <Route
          path="schedule"
          element={<SchedulePage />}
        />

        <Route
          path="assignments"
          element={<AssignmentsPage />}
        />

        <Route
          path="assignments/:assignmentId"
          element={<AssignmentDetailsPage />}
        />

        <Route
          path="tests"
          element={<CodingTestsPage />}
        />

        <Route
          path="tests/:testId"
          element={<TestDetailsPage />}
        />

        <Route
          path="tests/:testId/result"
          element={<TestResultPage />}
        />

        <Route
          path="progress"
          element={<ProgressPage />}
        />

        <Route
          path="results"
          element={<ResultsPage />}
        />

        <Route
          path="certificates"
          element={<CertificatesPage />}
        />

        <Route
          path="notifications"
          element={<StudentNotificationsPage />}
        />

        <Route
          path="resources"
          element={<ResourcesPage />}
        />

        <Route
          path="support"
          element={<SupportPage />}
        />

        <Route
          path="settings"
          element={<SettingsPage />}
        />

      </Route>


      <Route
        path="*"
        element={<NotFoundPage />}
      />

    </Routes>
  );
}

