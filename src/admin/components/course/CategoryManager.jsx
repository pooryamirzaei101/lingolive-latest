import { useState } from "react";

export default function CategoryManager() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Grammar",
      icon: "📘",
      color: "#3B82F6",
      courses: 12,
    },
    {
      id: 2,
      name: "IELTS",
      icon: "🎯",
      color: "#10B981",
      courses: 8,
    },
    {
      id: 3,
      name: "Vocabulary",
      icon: "📖",
      color: "#F59E0B",
      courses: 15,
    },
  ]);

  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (!newCategory.trim()) return;

    setCategories([
      ...categories,
      {
        id: Date.now(),
        name: newCategory,
        icon: "📁",
        color: "#6366F1",
        courses: 0,
      },
    ]);

    setNewCategory("");
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Course Categories
      </h2>

      <div className="flex gap-3 mb-6">

        <input
          type="text"
          className="flex-1 border rounded-lg p-3"
          placeholder="New category..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />

        <button
          onClick={addCategory}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg"
        >
          Add
        </button>

      </div>

      <div className="space-y-4">

        {categories.map((category) => (

          <div
            key={category.id}
            className="border rounded-xl p-4 flex justify-between items-center"
          >

            <div className="flex items-center gap-4">

              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                style={{
                  backgroundColor: category.color + "22",
                }}
              >
                {category.icon}
              </div>

              <div>

                <h3 className="font-bold">
                  {category.name}
                </h3>

                <p className="text-gray-500 text-sm">
                  {category.courses} Courses
                </p>

              </div>

            </div>

            <button
              onClick={() => deleteCategory(category.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}