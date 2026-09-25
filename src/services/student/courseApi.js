import { courses } from "../../data/student/coursesData";

export async function getCourses() {
  return courses;
}

export async function getCourseById(id) {
  return courses.find((course) => course.id === id) || null;
}
