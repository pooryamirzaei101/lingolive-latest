export default function GrammarPanel() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <h2 className="text-3xl font-bold mb-8">
        Grammar Focus
      </h2>

      {/* Rule */}

      <div className="mb-8">

        <h3 className="text-2xl font-semibold mb-4">
          Rule
        </h3>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded">

          <p className="text-lg">
            Subject + Base Verb (+ s / es) + Object
          </p>

        </div>

      </div>

      {/* Usage */}

      <div className="mb-8">

        <h3 className="text-2xl font-semibold mb-4">
          When Do We Use It?
        </h3>

        <ul className="list-disc ml-6 space-y-3 text-gray-700">

          <li>Daily routines</li>

          <li>Habits</li>

          <li>General facts</li>

          <li>Permanent situations</li>

          <li>Timetables and schedules</li>

        </ul>

      </div>

      {/* Examples */}

      <div className="mb-8">

        <h3 className="text-2xl font-semibold mb-4">
          Examples
        </h3>

        <div className="space-y-4">

          <div className="bg-green-50 p-4 rounded-lg">
            ✅ I study English every day.
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            ✅ She works in a hospital.
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            ✅ They live in Germany.
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            ✅ The Earth moves around the Sun.
          </div>

        </div>

      </div>

      {/* Common Mistakes */}

      <div>

        <h3 className="text-2xl font-semibold mb-4">
          Common Mistakes
        </h3>

        <div className="space-y-4">

          <div className="bg-red-50 border border-red-200 rounded-lg p-5">

            <p className="text-red-600 font-semibold">
              ❌ She work every day.
            </p>

            <p className="mt-2 text-green-700">
              ✅ She works every day.
            </p>

          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-5">

            <p className="text-red-600 font-semibold">
              ❌ He go to school.
            </p>

            <p className="mt-2 text-green-700">
              ✅ He goes to school.
            </p>

          </div>

        </div>

      </div>

      {/* Tip */}

      <div className="mt-10 bg-yellow-50 border border-yellow-300 rounded-lg p-5">

        <h3 className="font-bold text-lg mb-2">
          💡 Grammar Tip
        </h3>

        <p>
          Whenever the subject is <strong>he</strong>,
          <strong> she</strong>, or <strong>it</strong>,
          remember to add <strong>-s</strong> or
          <strong>-es</strong> to the main verb.
        </p>

      </div>

    </div>
  );
}