import { useNavigate } from "react-router-dom";
import NewsletterSignup from "../newsletter/components/NewsletterSignup";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">

      {/* ================= Hero Section ================= */}

      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">

          <h1 className="text-5xl font-bold mb-6">
            Learn English With Confidence
          </h1>

          <p className="text-xl mb-8 max-w-3xl">
            Courses, IELTS Preparation, Grammar, Stories, Podcasts,
            Vocabulary, Flashcards and more — all in one platform.
          </p>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
          >
            Start Learning
          </button>

        </div>
      </section>

      {/* ================= Features ================= */}

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-bold mb-10 text-center">
            What You Can Learn
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Courses */}

            <div className="border rounded-xl p-6 shadow">
              <h3 className="text-xl font-bold mb-3">
                📚 Courses
              </h3>

              <p className="text-gray-600">
                Complete English courses from beginner to advanced.
              </p>
            </div>

            {/* IELTS */}

            <div className="border rounded-xl p-6 shadow">
              <h3 className="text-xl font-bold mb-3">
                🎓 IELTS
              </h3>

              <p className="text-gray-600">
                Reading, Listening, Writing and Speaking preparation.
              </p>
            </div>

            {/* Grammar */}

            <div className="border rounded-xl p-6 shadow">
              <h3 className="text-xl font-bold mb-3">
                📖 Grammar
              </h3>

              <p className="text-gray-600">
                Grammar lessons with examples and quizzes.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ================= Newsletter ================= */}

      <NewsletterSignup />

    </div>
  );
}

export default Home;