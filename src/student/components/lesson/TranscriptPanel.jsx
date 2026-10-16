import { useState } from "react";

export default function TranscriptPanel() {
  const [showTranscript, setShowTranscript] = useState(true);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-3xl font-bold">
          Lesson Transcript
        </h2>

        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          {showTranscript ? "Hide Transcript" : "Show Transcript"}
        </button>

      </div>

      {showTranscript && (

        <div className="space-y-6 leading-8 text-gray-700">

          <p>
            Welcome to today's English lesson.
            In this lesson we will learn how to use the
            Present Simple Tense correctly in everyday English.
          </p>

          <p>
            We use the Present Simple to describe routines,
            habits, facts and permanent situations.
          </p>

          <p>
            For example:
          </p>

          <div className="bg-gray-100 rounded-lg p-5">

            <p>I wake up at 7 o'clock every morning.</p>

            <p>She studies English every day.</p>

            <p>They live in Germany.</p>

            <p>The Earth moves around the Sun.</p>

          </div>

          <p>
            Remember that with <strong>he</strong>,
            <strong> she</strong> and
            <strong> it</strong> we normally add
            <strong> -s</strong> or
            <strong> -es</strong> to the verb.
          </p>

          <p>
            Continue practicing until you feel comfortable
            using this tense naturally.
          </p>

        </div>

      )}

    </div>
  );
}