import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function IELTS() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Back Button */}
        <div className="mb-8">
          <BackButton />
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            IELTS Preparation
          </h1>

          <p className="text-lg text-gray-600">
            Prepare for your IELTS exam with structured lessons,
            practice exercises, useful strategies, and exam-style
            activities.
          </p>

        </div>

        {/* Four IELTS Sections */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Reading */}
          <button
            type="button"
            onClick={() => navigate("/ielts/reading")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="text-5xl mb-5">
              📖
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              IELTS Reading
            </h2>

            <p className="text-gray-600 mb-6">
              Practice reading passages, question types,
              vocabulary, and reading strategies.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Reading Lessons →
            </span>
          </button>

          {/* Listening */}
          <button
            type="button"
            onClick={() => navigate("/ielts/listening")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="text-5xl mb-5">
              🎧
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              IELTS Listening
            </h2>

            <p className="text-gray-600 mb-6">
              Improve your listening skills with audio exercises,
              transcripts, and exam-style questions.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Listening Lessons →
            </span>
          </button>

          {/* Writing */}
          <button
            type="button"
            onClick={() => navigate("/ielts/writing")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="text-5xl mb-5">
              ✍️
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              IELTS Writing
            </h2>

            <p className="text-gray-600 mb-6">
              Learn how to write strong Task 1 and Task 2 answers
              with useful structures and examples.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Writing Lessons →
            </span>
          </button>

          {/* Speaking */}
          <button
            type="button"
            onClick={() => navigate("/ielts/speaking")}
            className="text-left bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="text-5xl mb-5">
              🗣️
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              IELTS Speaking
            </h2>

            <p className="text-gray-600 mb-6">
              Practice speaking topics, useful expressions,
              pronunciation, and exam strategies.
            </p>

            <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold">
              View Speaking Lessons →
            </span>
          </button>

        </div>

        {/* Lesson Library Information */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mt-10">

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            IELTS Lesson Library
          </h2>

          <p className="text-gray-600">
            Your IELTS lessons will be added and managed through
            the Admin Panel. Reading, Listening, Writing, and
            Speaking lessons will appear in their respective
            sections.
          </p>

        </section>

      </div>

    </div>
  );
}

export default IELTS;
