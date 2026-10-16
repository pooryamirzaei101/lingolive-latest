export default function QuickStatistics() {
  const stats = [
    {
      title: "Courses Enrolled",
      value: 12,
      color: "bg-blue-500",
      icon: "📚",
    },
    {
      title: "Lessons Completed",
      value: 86,
      color: "bg-green-500",
      icon: "✅",
    },
    {
      title: "Study Hours",
      value: 154,
      color: "bg-purple-500",
      icon: "⏰",
    },
    {
      title: "Certificates",
      value: 5,
      color: "bg-yellow-500",
      icon: "🏆",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {stats.map((item, index) => (

        <div
          key={index}
          className="bg-white rounded-xl shadow p-6"
        >

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500 text-sm">
                {item.title}
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {item.value}
              </h2>

            </div>

            <div
              className={`${item.color} w-14 h-14 rounded-full flex items-center justify-center text-2xl text-white`}
            >
              {item.icon}
            </div>

          </div>

        </div>

      ))}

    </div>
  );
}