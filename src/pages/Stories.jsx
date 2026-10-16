import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function Stories() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ================= Back Button ================= */}

        <div className="mb-8">
          <BackButton />
        </div>

        {/* ================= Header ================= */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            English Stories
          </h1>

          <p className="text-lg text-gray-600">
            Improve your English through interesting stories,
            useful vocabulary, reading practice, and comprehension
            activities.
          </p>

        </div>

        {/* ================= Story Levels ================= */}

        <div className="grid md:grid-cols-3 gap-6">

          {/* Beginner */}

          <button
            type="button"
            onClick={() => navigate("/stories/beginner")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="text-5xl mb-5">
              🌱
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Beginner Stories
            </h2>

            <p className="text-gray-600 mb-6">
              Easy English stories with simple vocabulary,
              sentences, translations, and comprehension practice.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Beginner Stories →
            </span>

          </button>

          {/* Intermediate */}

          <button
            type="button"
            onClick={() => navigate("/stories/intermediate")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="text-5xl mb-5">
              📚
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Intermediate Stories
            </h2>

            <p className="text-gray-600 mb-6">
              Develop your reading skills with longer stories,
              useful expressions, vocabulary, and exercises.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Intermediate Stories →
            </span>

          </button>

          {/* Advanced */}

          <button
            type="button"
            onClick={() => navigate("/stories/advanced")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="text-5xl mb-5">
              🎓
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Advanced Stories
            </h2>

            <p className="text-gray-600 mb-6">
              Challenge yourself with advanced stories,
              complex vocabulary, idioms, and deeper comprehension.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Advanced Stories →
            </span>

          </button>

        </div>

        {/* ================= Story Library ================= */}

        <section className="bg-white rounded-2xl shadow-lg p-8 mt-10">

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Story Library
          </h2>

          <p className="text-gray-600">
            Stories will be organized by English level. You will
            eventually be able to add and manage stories from the
            Admin Panel, and they will appear automatically in the
            appropriate section.
          </p>

        </section>

      </div>

    </div>
  );
}

export default Stories;