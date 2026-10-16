import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";

function Courses() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <BackButton />

      {/* Header */}

      <div className="bg-white rounded-2xl shadow-lg p-10 mt-6 mb-10">

        <h1 className="text-5xl font-bold mb-4">
          English Courses
        </h1>

        <p className="text-xl text-gray-600">
          Choose a course and start learning English today.
        </p>

      </div>

      {/* Courses */}

      <div className="grid md:grid-cols-3 gap-8">

        {/* Beginner English */}

        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">

          <div className="text-5xl mb-5">
            📘
          </div>

          <h2 className="text-3xl font-bold mb-4">
            Beginner English
          </h2>

          <p className="text-gray-600 mb-8">
            Learn English step by step from the very beginning with
            lessons, exercises and quizzes.
          </p>

          <Link
            to="/beginner-english"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Open Course
          </Link>

        </div>

        {/* IELTS */}

        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">

          <div className="text-5xl mb-5">
            🎓
          </div>

          <h2 className="text-3xl font-bold mb-4">
            IELTS Preparation
          </h2>

          <p className="text-gray-600 mb-8">
            Prepare for IELTS Reading, Listening,
            Writing and Speaking.
          </p>

          <Link
            to="/ielts-preparation"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Open Course
          </Link>

        </div>

        {/* Grammar */}

        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">

          <div className="text-5xl mb-5">
            📚
          </div>

          <h2 className="text-3xl font-bold mb-4">
            Grammar Master
          </h2>

          <p className="text-gray-600 mb-8">
            Master English grammar with professional
            lessons and quizzes.
          </p>

          <Link
            to="/grammar-master"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Open Course
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Courses;