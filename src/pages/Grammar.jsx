import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";

function Grammar() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Back Button */}
      <BackButton />


      {/* Header */}
      <section className="bg-white rounded-2xl shadow-lg p-10 mt-6 mb-10">

        <h1 className="text-5xl font-bold mb-4">
          📚 Grammar
        </h1>

        <p className="text-xl text-gray-600">
          Improve your English grammar with clear lessons,
          examples, exercises, and quizzes.
        </p>

      </section>



      {/* Grammar Levels */}
      <div className="grid md:grid-cols-3 gap-8">


        {/* Beginner */}

        <Link
          to="/grammar/beginner"
          className="
            bg-white
            rounded-2xl
            shadow-lg
            p-8
            hover:shadow-xl
            transition
          "
        >

          <div className="text-5xl mb-5">
            🌱
          </div>


          <h2 className="text-3xl font-bold mb-4">
            Beginner Grammar
          </h2>


          <p className="text-gray-600 mb-6">
            Learn the essential grammar rules for building
            a strong English foundation.
          </p>


          <span className="
            inline-block
            bg-blue-600
            text-white
            px-5
            py-2
            rounded-lg
          ">
            Open Level
          </span>


        </Link>




        {/* Intermediate */}

        <Link
          to="/grammar/intermediate"
          className="
            bg-white
            rounded-2xl
            shadow-lg
            p-8
            hover:shadow-xl
            transition
          "
        >

          <div className="text-5xl mb-5">
            📘
          </div>


          <h2 className="text-3xl font-bold mb-4">
            Intermediate Grammar
          </h2>


          <p className="text-gray-600 mb-6">
            Improve your grammar with more advanced topics
            and practical examples.
          </p>


          <span className="
            inline-block
            bg-blue-600
            text-white
            px-5
            py-2
            rounded-lg
          ">
            Open Level
          </span>


        </Link>





        {/* Advanced */}

        <Link
          to="/grammar/advanced"
          className="
            bg-white
            rounded-2xl
            shadow-lg
            p-8
            hover:shadow-xl
            transition
          "
        >

          <div className="text-5xl mb-5">
            🎓
          </div>


          <h2 className="text-3xl font-bold mb-4">
            Advanced Grammar
          </h2>


          <p className="text-gray-600 mb-6">
            Master complex grammar structures and improve
            your fluency and accuracy.
          </p>


          <span className="
            inline-block
            bg-blue-600
            text-white
            px-5
            py-2
            rounded-lg
          ">
            Open Level
          </span>


        </Link>


      </div>

    </div>
  );
}

export default Grammar;