import { useCart } from "../../context/CartContext";

export default function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartSubtotal,
  } = useCart();

  const total = cartSubtotal;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart
          </h1>

          <p className="mt-2 text-gray-600">
            Review your items before checkout.
          </p>
        </div>

        {cartItems.length === 0 ? (

          /* Empty Cart */
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">

            <div className="mb-4 text-5xl">
              🛒
            </div>

            <h2 className="text-2xl font-semibold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-600">
              Add some products from the shop to get started.
            </p>

            <button
              onClick={() => {
                window.location.href = "/shop";
              }}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Continue Shopping
            </button>

          </div>

        ) : (

          <div className="grid gap-8 lg:grid-cols-3">

            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">

              {cartItems.map((item) => (

                <div
                  key={item.id}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    {/* Product Information */}
                    <div>

                      <h2 className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </h2>

                      <p className="mt-1 text-gray-600">
                        ${item.price.toFixed(2)}
                      </p>

                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">

                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-lg hover:bg-gray-100"
                      >
                        −
                      </button>

                      <span className="min-w-[20px] text-center font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-lg hover:bg-gray-100"
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                  {/* Item Total */}
                  <div className="mt-5 border-t pt-4 text-right">

                    <span className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                  </div>

                </div>

              ))}

            </div>

            {/* Order Summary */}
            <div className="h-fit rounded-xl bg-white p-6 shadow-sm">

              <h2 className="text-xl font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                {/* Subtotal */}
                <div className="flex justify-between text-gray-600">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    ${cartSubtotal.toFixed(2)}
                  </span>

                </div>

                {/* Total */}
                <div className="border-t pt-4">

                  <div className="flex justify-between text-lg font-bold text-gray-900">

                    <span>
                      Total
                    </span>

                    <span>
                      ${total.toFixed(2)}
                    </span>

                  </div>

                </div>

              </div>

              {/* Proceed to Checkout */}
              <button
                onClick={() => {
                  window.location.href = "/checkout";
                }}
                className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => {
                  window.location.href = "/shop";
                }}
                className="mt-3 w-full rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Continue Shopping
              </button>

            </div>

          </div>

        )}

      </div>
    </div>
  );
}