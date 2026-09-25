import {
  studentProfile,
  dashboardStats,
  notifications,
} from "../../data/student/studentData";

export async function getStudentProfile() {
  return studentProfile;
}

export async function getDashboardStats() {
  return dashboardStats;
}

export async function getStudentNotifications() {
  return notifications;
}
