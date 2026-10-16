export default function RecentActivity() {
  const activities = [
    "New lesson added",
    "Student purchased IELTS Course",
    "PDF uploaded",
    "Podcast published",
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-10">
      <h2 className="text-2xl font-bold mb-6">
        Recent Activity
      </h2>

      <ul className="space-y-3">
        {activities.map((activity, index) => (
          <li
            key={index}
            className="border-b pb-2"
          >
            {activity}
          </li>
        ))}
      </ul>
    </div>
  );
}