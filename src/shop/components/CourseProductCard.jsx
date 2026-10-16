export default function CourseProductCard({ product, onView }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition">

      {/* Course Preview */}
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-2">🎓</div>

          <span className="text-sm font-semibold text-blue-600">
            Course
          </span>
        </div>
      </div>

      {/* Course Information */}
      <div className="p-5">

        <div className="flex items-center justify-between gap-3 mb-3">

          <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            Course
          </span>

          <span className="text-xs text-gray-500">
            {product.lessons
              ? `${product.lessons} lessons`
              : "Online Course"}
          </span>

        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {product.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {product.description}
        </p>

        {/* Level */}

        {product.level && (
          <div className="text-sm text-gray-500 mb-4">
            Level:{" "}
            <span className="font-semibold text-gray-700">
              {product.level}
            </span>
          </div>
        )}

        {/* Price + Button */}

        <div className="flex items-center justify-between gap-4">

          <span className="text-xl font-bold text-gray-900">
            {product.price === 0
              ? "Free"
              : `$${product.price}`}
          </span>

          <button
            type="button"
            onClick={() => onView(product)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            View Course
          </button>

        </div>

      </div>

    </div>
  );
}