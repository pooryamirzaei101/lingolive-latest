export default function CourseProductDetails({
  product,
  onClose,
  onAddToCart,
}) {
  if (!product) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}

        <div className="flex items-center justify-between p-6 border-b">

          <h2 className="text-2xl font-bold">
            Course Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 text-2xl"
            aria-label="Close"
          >
            ×
          </button>

        </div>

        {/* Content */}

        <div className="p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Course Preview */}

            <div className="h-72 bg-gray-100 rounded-xl flex items-center justify-center">

              <div className="text-center">

                <div className="text-8xl mb-4">
                  🎓
                </div>

                <div className="text-blue-600 font-bold text-lg">
                  Online Course
                </div>

                {product.lessons && (
                  <div className="text-gray-500 mt-2">
                    {product.lessons} lessons
                  </div>
                )}

              </div>

            </div>

            {/* Course Information */}

            <div>

              <div className="flex flex-wrap gap-2 mb-4">

                <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  Course
                </span>

                {product.category && (
                  <span className="text-sm font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                )}

              </div>

              <h3 className="text-3xl font-bold mb-4">
                {product.title}
              </h3>

              <p className="text-gray-600 leading-7 mb-6">
                {product.description}
              </p>

              {/* Course Details */}

              <div className="space-y-2 mb-6 text-sm">

                {product.level && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">
                      Level
                    </span>

                    <span className="font-semibold">
                      {product.level}
                    </span>
                  </div>
                )}

                {product.lessons && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">
                      Lessons
                    </span>

                    <span className="font-semibold">
                      {product.lessons}
                    </span>
                  </div>
                )}

                {product.duration && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">
                      Duration
                    </span>

                    <span className="font-semibold">
                      {product.duration}
                    </span>
                  </div>
                )}

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">
                    Format
                  </span>

                  <span className="font-semibold">
                    Online Course
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span className="font-semibold">
                    Online Access
                  </span>
                </div>

              </div>

              {/* Price */}

              <div className="text-3xl font-bold mb-6">

                {product.price === 0 ? (
                  <span className="text-green-600">
                    Free
                  </span>
                ) : (
                  `$${product.price}`
                )}

              </div>

              {/* Add to Cart */}

              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Add Course to Cart
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}