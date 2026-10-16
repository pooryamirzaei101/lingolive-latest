export default function PDFProductDetails({
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
            PDF Details
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

            {/* PDF Preview */}
            <div className="h-72 bg-gray-100 rounded-xl flex items-center justify-center">

              <div className="text-center">

                <div className="text-8xl mb-4">
                  📄
                </div>

                <div className="text-red-600 font-bold text-lg">
                  PDF
                </div>

                {product.pages && (
                  <div className="text-gray-500 mt-2">
                    {product.pages} pages
                  </div>
                )}

              </div>

            </div>

            {/* Product Information */}
            <div>

              <div className="flex gap-2 mb-4">

                <span className="text-sm font-semibold bg-red-100 text-red-700 px-3 py-1 rounded-full">
                  PDF
                </span>

                {product.category && (
                  <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
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

              {/* Details */}
              <div className="space-y-2 mb-6 text-sm">

                {product.pages && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">
                      Pages
                    </span>

                    <span className="font-semibold">
                      {product.pages}
                    </span>
                  </div>
                )}

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">
                    Format
                  </span>

                  <span className="font-semibold">
                    PDF
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span className="font-semibold">
                    Digital
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
                Add PDF to Cart
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}