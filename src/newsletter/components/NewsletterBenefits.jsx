const benefits = [
  {
    icon: "📚",
    title: "Daily English Lessons",
    description:
      "Receive useful English lessons regularly to keep improving your skills.",
  },
  {
    icon: "🧠",
    title: "Vocabulary Tips",
    description:
      "Learn useful words, phrases, examples, and expressions for everyday English.",
  },
  {
    icon: "✏️",
    title: "Grammar Tips",
    description:
      "Understand important grammar rules with simple explanations and examples.",
  },
  {
    icon: "🎯",
    title: "IELTS Advice",
    description:
      "Get practical IELTS strategies, study tips, and useful exam resources.",
  },
  {
    icon: "📖",
    title: "English Stories",
    description:
      "Improve your reading skills with interesting stories suitable for English learners.",
  },
  {
    icon: "🎧",
    title: "Learning Resources",
    description:
      "Discover useful podcasts, exercises, PDFs, and other English-learning resources.",
  },
];

export default function NewsletterBenefits() {
  return (
    <section className="py-14 bg-gray-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-10">

          <p className="text-blue-600 font-semibold mb-2">
            What You'll Receive
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Learn Something New Every Day
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Our newsletter is designed to give you practical
            English-learning content without overwhelming you.
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >

              <div className="text-4xl mb-4">
                {benefit.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {benefit.title}
              </h3>

              <p className="text-gray-600 leading-7">
                {benefit.description}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}