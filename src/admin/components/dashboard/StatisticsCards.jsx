export default function StatisticsCards() {
  const stats = [
    {
      title: "Lessons",
      value: 125,
      color: "bg-blue-500",
    },
    {
      title: "Courses",
      value: 18,
      color: "bg-green-500",
    },
    {
      title: "Students",
      value: 248,
      color: "bg-purple-500",
    },
    {
      title: "Orders",
      value: 72,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-10">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white rounded-xl shadow p-6"
        >
          <div
            className={`w-4 h-4 rounded-full ${item.color} mb-4`}
          ></div>

          <h3 className="text-gray-500">
            {item.title}
          </h3>

          <p className="text-4xl font-bold mt-3">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}