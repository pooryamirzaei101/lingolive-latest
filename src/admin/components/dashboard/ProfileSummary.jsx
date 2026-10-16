export default function ProfileSummary() {
  const student = {
    name: "John Smith",
    email: "john@example.com",
    memberSince: "January 2026",
    streak: 28,
    points: 1240,
    level: "Intermediate",
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex flex-col items-center">

        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
          JS
        </div>

        <h2 className="text-2xl font-bold mt-4">
          {student.name}
        </h2>

        <p className="text-gray-500">
          {student.email}
        </p>

      </div>

      <div className="mt-8 space-y-4">

        <div className="flex justify-between">

          <span className="text-gray-500">
            Level
          </span>

          <span className="font-semibold">
            {student.level}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-500">
            Member Since
          </span>

          <span className="font-semibold">
            {student.memberSince}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-500">
            Learning Streak
          </span>

          <span className="font-semibold text-orange-500">
            🔥 {student.streak} Days
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-500">
            Total Points
          </span>

          <span className="font-semibold text-blue-600">
            ⭐ {student.points}
          </span>

        </div>

      </div>

      <button
        className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
      >
        Edit Profile
      </button>

    </div>
  );
}