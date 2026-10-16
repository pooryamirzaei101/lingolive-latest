import { useState } from "react";
import CourseFilters from "./CourseFilters";
import CourseTable from "./CourseTable";

export default function CourseLibrary() {
  const [courses] = useState([
    {
      id: 1,
      title: "IELTS Master Course",
      category: "IELTS",
      teacher: "Admin",
      lessons: 48,
      price: 99,
      status: "Published",
    },
    {
      id: 2,
      title: "English Grammar A1",
      category: "Grammar",
      teacher: "Admin",
      lessons: 32,
      price: 59,
      status: "Draft",
    },
    {
      id: 3,
      title: "Vocabulary 3000",
      category: "Vocabulary",
      teacher: "Admin",
      lessons: 120,
      price: 79,
      status: "Draft",
    },
  ]);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-3xl font-bold mb-8">
        Course Library
      </h2>

      <CourseFilters />

      <CourseTable courses={courses} />
    </div>
  );
}
