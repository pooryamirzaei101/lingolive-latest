import { useState } from "react";
import ModuleCard from "./ModuleCard";

export default function ModuleList() {
  const [modules] = useState([
    {
      id: 1,
      title: "Module 1 - Introduction",
      lessons: [
        {
          id: 1,
          title: "Welcome",
          duration: "05:30",
          completed: true,
          locked: false,
        },
        {
          id: 2,
          title: "Course Overview",
          duration: "08:10",
          completed: true,
          locked: false,
        },
      ],
    },
    {
      id: 2,
      title: "Module 2 - Grammar",
      lessons: [
        {
          id: 3,
          title: "Present Simple",
          duration: "18:40",
          completed: false,
          locked: false,
        },
        {
          id: 4,
          title: "Present Continuous",
          duration: "21:15",
          completed: false,
          locked: true,
        },
      ],
    },
    {
      id: 3,
      title: "Module 3 - Speaking",
      lessons: [
        {
          id: 5,
          title: "Daily Conversation",
          duration: "15:00",
          completed: false,
          locked: true,
        },
      ],
    },
  ]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <h2 className="text-3xl font-bold mb-8">
        Course Content
      </h2>

      <div className="space-y-5">

        {modules.map((module) => (

          <ModuleCard
            key={module.id}
            module={module}
          />

        ))}

      </div>

    </div>
  );
}