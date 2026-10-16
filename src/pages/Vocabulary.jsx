import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function Vocabulary() {
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
            English Vocabulary
          </h1>

          <p className="text-lg text-gray-600">
            Build your English vocabulary with useful words,
            phrases, examples, pronunciation, exercises, and
            everyday English.
          </p>

        </div>

        {/* ================= Vocabulary Levels ================= */}

        <div className="grid md:grid-cols-3 gap-6">

          {/* ================= Beginner ================= */}

          <button
            type="button"
            onClick={() => navigate("/vocabulary/beginner")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="text-5xl mb-5">
              🌱
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Beginner Vocabulary
            </h2>

            <p className="text-gray-600 mb-6">
              Learn essential English words and phrases for
              everyday situations and basic communication.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Beginner Vocabulary →
            </span>

          </button>


          {/* ================= Intermediate ================= */}

          <button
            type="button"
            onClick={() => navigate("/vocabulary/intermediate")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="text-5xl mb-5">
              📚
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Intermediate Vocabulary
            </h2>

            <p className="text-gray-600 mb-6">
              Expand your vocabulary with useful expressions,
              collocations, phrasal verbs, and common phrases.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Intermediate Vocabulary →
            </span>

          </button>


          {/* ================= Advanced ================= */}

          <button
            type="button"
            onClick={() => navigate("/vocabulary/advanced")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="text-5xl mb-5">
              🎓
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Advanced Vocabulary
            </h2>

            <p className="text-gray-600 mb-6">
              Master advanced words, academic vocabulary,
              idioms, sophisticated expressions, and collocations.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Advanced Vocabulary →
            </span>

          </button>

        </div>


        {/* ================= Vocabulary Library ================= */}

        <section className="bg-white rounded-2xl shadow-lg p-8 mt-10">

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Vocabulary Library
          </h2>

          <p className="text-gray-600">
            Vocabulary lessons will be organized by English level.
            You will eventually be able to add and manage vocabulary
            lessons from the Admin Panel, including words, definitions,
            examples, pronunciation, exercises, and translations.
          </p>

        </section>

      </div>

    </div>
  );
}

export default Vocabulary;