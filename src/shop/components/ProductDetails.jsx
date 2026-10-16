export default function ProductDetails({
  product,
  onClose,
  onAddToCart,
}) {
  if (!product) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}

        <div className="flex items-center justify-between p-6 border-b">

          <h2 className="text-2xl font-bold">
            Product Details
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

        {/* Product */}

        <div className="p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Image */}

            <div className="h-64 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">

              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-7xl">
                  📚
                </span>
              )}

            </div>

            {/* Information */}

            <div>

              <div className="flex gap-2 mb-4">

                <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  {product.category}
                </span>

                <span className="text-sm font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  {product.type}
                </span>

              </div>

              <h3 className="text-3xl font-bold mb-4">
                {product.title}
              </h3>

              <p className="text-gray-600 leading-7 mb-6">
                {product.description}
              </p>

              <div className="text-3xl font-bold mb-6">

                {product.price === 0 ? (
                  <span className="text-green-600">
                    Free
                  </span>
                ) : (
                  `$${product.price}`
                )}

              </div>

              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Add to Cart
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}