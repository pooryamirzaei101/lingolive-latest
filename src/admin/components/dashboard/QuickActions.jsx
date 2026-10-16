import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-10">

      <h2 className="text-2xl font-bold mb-6">
        Quick Actions
      </h2>


      <div className="grid md:grid-cols-4 gap-4">

        <button
          type="button"
          onClick={() =>
            document
              .getElementById("lesson-form")
              ?.scrollIntoView({
                behavior: "smooth",
              })
          }
          className="bg-blue-600 text-white rounded-lg p-4 hover:bg-blue-700"
        >
          Add Lesson
        </button>


        <button
          type="button"
          onClick={() =>
            document
              .getElementById("course-editor")
              ?.scrollIntoView({
                behavior: "smooth",
              })
          }
          className="bg-green-600 text-white rounded-lg p-4 hover:bg-green-700"
        >
          Add Course
        </button>


        <button
          type="button"
          onClick={() =>
            alert("PDF Upload will be connected in the Media Manager phase.")
          }
          className="bg-purple-600 text-white rounded-lg p-4 hover:bg-purple-700"
        >
          Upload PDF
        </button>


        <button
          type="button"
          onClick={() =>
            navigate("/dashboard")
          }
          className="bg-orange-600 text-white rounded-lg p-4 hover:bg-orange-700"
        >
          View Orders
        </button>

      </div>

    </div>
  );
}