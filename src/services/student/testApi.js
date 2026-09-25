import {
  tests,
  previousResults,
} from "../../data/student/testsData";

export async function getTests() {
  return tests;
}

export async function getTestById(id) {
  return tests.find((test) => test.id === id) || null;
}

export async function getResults() {
  return previousResults;
}
