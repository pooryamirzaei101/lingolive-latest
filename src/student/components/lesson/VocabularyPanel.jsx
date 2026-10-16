import { useState } from "react";

export default function VocabularyPanel() {
  const [vocabulary] = useState([
    {
      word: "Habit",
      pronunciation: "/ˈhæbɪt/",
      meaning: "Something that you do regularly.",
      example: "Reading English books is a good habit.",
    },
    {
      word: "Routine",
      pronunciation: "/ruːˈtiːn/",
      meaning: "A usual way of doing things.",
      example: "My morning routine starts at 7 AM.",
    },
    {
      word: "Permanent",
      pronunciation: "/ˈpɜːrmənənt/",
      meaning: "Continuing for a long time.",
      example: "London is her permanent home.",
    },
    {
      word: "Fact",
      pronunciation: "/fækt/",
      meaning: "Something that is true.",
      example: "Water freezes at 0°C. This is a fact.",
    },
    {
      word: "Practice",
      pronunciation: "/ˈpræktɪs/",
      meaning: "Doing something repeatedly to improve.",
      example: "Practice English every day.",
    },
  ]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <div className="flex justify-between items-center mb-8">

        <h2 className="text-3xl font-bold">
          Vocabulary
        </h2>

        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">
          {vocabulary.length} Words
        </span>

      </div>

      <div className="space-y-6">

        {vocabulary.map((item, index) => (

          <div
            key={index}
            className="border rounded-xl p-6 hover:shadow-md transition"
          >

            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

              <div>

                <h3 className="text-2xl font-bold">
                  {item.word}
                </h3>

                <p className="text-blue-600 mt-1">
                  {item.pronunciation}
                </p>

              </div>

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
                🔊 Listen
              </button>

            </div>

            <div className="mt-5">

              <h4 className="font-semibold text-gray-700">
                Meaning
              </h4>

              <p className="mt-2 text-gray-600">
                {item.meaning}
              </p>

            </div>

            <div className="mt-5">

              <h4 className="font-semibold text-gray-700">
                Example
              </h4>

              <div className="bg-gray-100 rounded-lg p-4 mt-2">

                {item.example}

              </div>

            </div>

          </div>

        ))}

      </div>

      <div className="mt-10 bg-green-50 border border-green-200 rounded-lg p-5">

        <h3 className="font-bold text-lg mb-2">
          📚 Vocabulary Tip
        </h3>

        <p>
          Try learning 5–10 new words every day and use each word in your
          own sentence. This helps you remember vocabulary much longer.
        </p>

      </div>

    </div>
  );
}