import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function Flashcards() {
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
            English Flashcards
          </h1>

          <p className="text-lg text-gray-600">
            Learn and review English vocabulary with interactive
            flashcards designed to help you remember words and
            expressions more effectively.
          </p>

        </div>

        {/* ================= Flashcard Levels ================= */}

        <div className="grid md:grid-cols-3 gap-6">

          {/* ================= Beginner ================= */}

          <button
            type="button"
            onClick={() => navigate("/flashcards/beginner")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="text-5xl mb-5">
              🌱
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Beginner Flashcards
            </h2>

            <p className="text-gray-600 mb-6">
              Practice essential English words and everyday
              vocabulary with simple interactive flashcards.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Beginner Flashcards →
            </span>

          </button>


          {/* ================= Intermediate ================= */}

          <button
            type="button"
            onClick={() => navigate("/flashcards/intermediate")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="text-5xl mb-5">
              📚
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Intermediate Flashcards
            </h2>

            <p className="text-gray-600 mb-6">
              Expand your vocabulary with useful expressions,
              collocations, phrasal verbs, and intermediate words.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Intermediate Flashcards →
            </span>

          </button>


          {/* ================= Advanced ================= */}

          <button
            type="button"
            onClick={() => navigate("/flashcards/advanced")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="text-5xl mb-5">
              🎓
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Advanced Flashcards
            </h2>

            <p className="text-gray-600 mb-6">
              Master advanced vocabulary, academic words,
              idioms, sophisticated expressions, and collocations.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Advanced Flashcards →
            </span>

          </button>

        </div>


        {/* ================= Flashcard Library ================= */}

        <section className="bg-white rounded-2xl shadow-lg p-8 mt-10">

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Flashcard Library
          </h2>

          <p className="text-gray-600">
            Flashcard sets will be organized by English level.
            You will eventually be able to create and manage
            flashcards from the Admin Panel and connect them
            to your vocabulary lessons.
          </p>

        </section>

      </div>

    </div>
  );
}

export default Flashcards;