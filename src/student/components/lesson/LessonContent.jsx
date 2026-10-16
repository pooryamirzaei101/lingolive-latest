export default function LessonContent() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <h2 className="text-3xl font-bold mb-8">
        Lesson Content
      </h2>

      <div className="space-y-8 text-gray-700 leading-8">

        <section>

          <h3 className="text-2xl font-bold mb-4">
            Introduction
          </h3>

          <p>
            The Present Simple Tense is one of the most important tenses
            in English. We use it to describe habits, routines,
            facts, and general truths.
          </p>

        </section>

        <section>

          <h3 className="text-2xl font-bold mb-4">
            Structure
          </h3>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded">

            <p className="font-semibold">
              Subject + Base Verb (+ s/es) + Object
            </p>

          </div>

        </section>

        <section>

          <h3 className="text-2xl font-bold mb-4">
            Examples
          </h3>

          <ul className="list-disc ml-6 space-y-3">

            <li>I study English every day.</li>

            <li>She works in a hospital.</li>

            <li>They play football every weekend.</li>

            <li>Water boils at 100°C.</li>

          </ul>

        </section>

        <section>

          <h3 className="text-2xl font-bold mb-4">
            Important Notes
          </h3>

          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-5">

            <p>
              Remember to add <strong>-s</strong> or
              <strong> -es</strong> to the verb when the subject is
              <strong> he</strong>,
              <strong> she</strong>,
              or <strong>it</strong>.
            </p>

          </div>

        </section>

        <section>

          <h3 className="text-2xl font-bold mb-4">
            Summary
          </h3>

          <p>
            The Present Simple Tense is used for routines, habits,
            permanent situations and facts. Mastering this tense is
            essential before learning more advanced grammar topics.
          </p>

        </section>

      </div>

    </div>
  );
}