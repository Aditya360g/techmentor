import { assignments } from "../../data/student/assignmentsData";

export async function getAssignments() {
  return assignments;
}

export async function getAssignmentById(id) {
  return assignments.find((item) => item.id === id) || null;
}
