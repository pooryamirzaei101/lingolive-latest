import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function Conversation() {
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
            English Conversation
          </h1>

          <p className="text-lg text-gray-600">
            Improve your speaking and communication skills with
            practical conversations, useful expressions, dialogues,
            pronunciation practice, and real-life situations.
          </p>

        </div>

        {/* ================= Conversation Levels ================= */}

        <div className="grid md:grid-cols-3 gap-6">

          {/* ================= Beginner ================= */}

          <button
            type="button"
            onClick={() => navigate("/conversation/beginner")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="text-5xl mb-5">
              🌱
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Beginner Conversation
            </h2>

            <p className="text-gray-600 mb-6">
              Learn simple conversations for introductions,
              daily activities, shopping, travel, and everyday life.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Beginner Lessons →
            </span>

          </button>

          {/* ================= Intermediate ================= */}

          <button
            type="button"
            onClick={() => navigate("/conversation/intermediate")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="text-5xl mb-5">
              💬
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Intermediate Conversation
            </h2>

            <p className="text-gray-600 mb-6">
              Practice natural conversations, useful expressions,
              opinions, discussions, and common real-life situations.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Intermediate Lessons →
            </span>

          </button>

          {/* ================= Advanced ================= */}

          <button
            type="button"
            onClick={() => navigate("/conversation/advanced")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="text-5xl mb-5">
              🎓
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Advanced Conversation
            </h2>

            <p className="text-gray-600 mb-6">
              Develop advanced speaking skills through discussions,
              debates, idiomatic expressions, and complex topics.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Advanced Lessons →
            </span>

          </button>

        </div>

        {/* ================= Conversation Library ================= */}

        <section className="bg-white rounded-2xl shadow-lg p-8 mt-10">

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Conversation Lesson Library
          </h2>

          <p className="text-gray-600">
            Conversation lessons will be organized by English
            level. You will eventually be able to add and manage
            lessons from the Admin Panel, including dialogues,
            audio, transcripts, translations, vocabulary, and
            speaking exercises.
          </p>

        </section>

      </div>

    </div>
  );
}

export default Conversation;