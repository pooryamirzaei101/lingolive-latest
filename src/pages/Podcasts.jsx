import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function Podcasts() {
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
            English Podcasts
          </h1>

          <p className="text-lg text-gray-600">
            Improve your English listening and speaking skills
            through podcasts, transcripts, vocabulary, and
            practical listening activities.
          </p>

        </div>

        {/* ================= Podcast Levels ================= */}

        <div className="grid md:grid-cols-3 gap-6">

          {/* Beginner */}

          <button
            type="button"
            onClick={() => navigate("/podcasts/beginner")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="text-5xl mb-5">
              🌱
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Beginner Podcasts
            </h2>

            <p className="text-gray-600 mb-6">
              Easy podcasts with clear English, useful vocabulary,
              transcripts, and simple listening exercises.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Beginner Podcasts →
            </span>

          </button>

          {/* Intermediate */}

          <button
            type="button"
            onClick={() => navigate("/podcasts/intermediate")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="text-5xl mb-5">
              🎧
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Intermediate Podcasts
            </h2>

            <p className="text-gray-600 mb-6">
              Develop your listening skills with natural English,
              longer conversations, transcripts, and vocabulary.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Intermediate Podcasts →
            </span>

          </button>

          {/* Advanced */}

          <button
            type="button"
            onClick={() => navigate("/podcasts/advanced")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="text-5xl mb-5">
              🎓
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Advanced Podcasts
            </h2>

            <p className="text-gray-600 mb-6">
              Challenge yourself with natural conversations,
              advanced vocabulary, idioms, and fast English.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Advanced Podcasts →
            </span>

          </button>

        </div>

        {/* ================= Podcast Library ================= */}

        <section className="bg-white rounded-2xl shadow-lg p-8 mt-10">

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Podcast Library
          </h2>

          <p className="text-gray-600">
            Podcasts will be organized by English level. You will
            eventually be able to add and manage podcast lessons
            from the Admin Panel, including audio, transcripts,
            translations, vocabulary, and exercises.
          </p>

        </section>

      </div>

    </div>
  );
}

export default Podcasts;