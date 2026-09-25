export const studentProfile = {
  id: "STU-2026-101",
  name: "Aditya Sharma",
  email: "student@example.com",
  phone: "+91 98765 43210",
  college: "RKGIT",
  branch: "Computer Science",
  semester: "5th Semester",
  enrollment: "CS2026101",
};

export const dashboardStats = [
  {
    title: "Active Courses",
    value: "3",
    change: "2 classes today",
    type: "courses",
  },
  {
    title: "Assignments",
    value: "5",
    change: "2 due this week",
    type: "assignments",
  },
  {
    title: "Tests Completed",
    value: "12",
    change: "Average 82%",
    type: "tests",
  },
  {
    title: "Overall Progress",
    value: "76%",
    change: "+8% this month",
    type: "progress",
  },
];

export const liveClasses = [
  {
    id: 1,
    courseId: "java-dsa",
    title: "Binary Trees & Traversals",
    trainer: "Aman Sharma",
    date: "25 Sep 2026",
    time: "10:30 AM",
    duration: "90 min",
    mode: "Google Meet",
    status: "Live",
  },
  {
    id: 2,
    courseId: "python-ai",
    title: "Python Data Analysis",
    trainer: "Priya Verma",
    date: "25 Sep 2026",
    time: "03:00 PM",
    duration: "60 min",
    mode: "Online",
    status: "Upcoming",
  },
  {
    id: 3,
    courseId: "fullstack",
    title: "React API Integration",
    trainer: "Rahul Mehta",
    date: "26 Sep 2026",
    time: "11:00 AM",
    duration: "90 min",
    mode: "Online",
    status: "Upcoming",
  },
];

export const scheduleItems = [
  {
    id: 1,
    title: "Java DSA Live Class",
    type: "Class",
    date: "25 Sep",
    time: "10:30 AM",
  },
  {
    id: 2,
    title: "Array Assignment Due",
    type: "Assignment",
    date: "25 Sep",
    time: "11:59 PM",
  },
  {
    id: 3,
    title: "Python Mock Test",
    type: "Test",
    date: "26 Sep",
    time: "04:00 PM",
  },
  {
    id: 4,
    title: "React Live Class",
    type: "Class",
    date: "27 Sep",
    time: "11:00 AM",
  },
  {
    id: 5,
    title: "Spring Boot Assignment",
    type: "Assignment",
    date: "29 Sep",
    time: "11:59 PM",
  },
];

export const notifications = [
  {
    id: 1,
    title: "New Assignment Added",
    message: "A new Java DSA assignment has been published.",
    time: "10 min ago",
    read: false,
    type: "assignment",
  },
  {
    id: 2,
    title: "Live Class Reminder",
    message: "Binary Trees class begins today at 10:30 AM.",
    time: "1 hour ago",
    read: false,
    type: "class",
  },
  {
    id: 3,
    title: "Test Result Available",
    message: "Your Python mock test result is now available.",
    time: "Yesterday",
    read: true,
    type: "result",
  },
  {
    id: 4,
    title: "Certificate Unlocked",
    message: "You completed the Git & GitHub workshop.",
    time: "2 days ago",
    read: true,
    type: "certificate",
  },
];

export const resources = [
  {
    id: 1,
    title: "Java DSA Notes",
    type: "PDF",
    course: "Java + DSA",
    size: "3.2 MB",
  },
  {
    id: 2,
    title: "Spring Boot API Guide",
    type: "PDF",
    course: "Full Stack",
    size: "2.4 MB",
  },
  {
    id: 3,
    title: "Python Practice Problems",
    type: "Worksheet",
    course: "Python & AI",
    size: "1.8 MB",
  },
  {
    id: 4,
    title: "React Project Starter",
    type: "Code",
    course: "Full Stack",
    size: "5.1 MB",
  },
];

export const certificates = [
  {
    id: "CERT-101",
    title: "Git & GitHub Workshop",
    issueDate: "12 Aug 2026",
    trainer: "Rahul Mehta",
  },
  {
    id: "CERT-102",
    title: "Core Java Fundamentals",
    issueDate: "04 Sep 2026",
    trainer: "Aman Sharma",
  },
];
