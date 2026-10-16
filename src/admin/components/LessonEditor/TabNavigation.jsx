const tabs = [
  "Basic",
  "Media",
  "Content",
  "Quiz",
  "Resources",
  "Publish",
  "SEO",
  "AI",
];

export default function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="flex flex-wrap gap-3 border-b pb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-5 py-2 rounded-lg font-medium transition ${
            activeTab === tab
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}