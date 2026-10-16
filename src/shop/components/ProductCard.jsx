export default function ProductCard({ product, onView }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition">

      {/* Product Image */}

      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">

        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-5xl">
            📚
          </div>
        )}

      </div>

      {/* Product Information */}

      <div className="p-5">

        <div className="flex items-center justify-between gap-3 mb-3">

          <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {product.category}
          </span>

          <span className="text-xs text-gray-500">
            {product.type}
          </span>

        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {product.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {product.description}
        </p>

        <div className="flex items-center justify-between gap-4">

          <div>
            {product.price === 0 ? (
              <span className="text-green-600 font-bold">
                Free
              </span>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                ${product.price}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onView(product)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            View Details
          </button>

        </div>

      </div>

    </div>
  );
}