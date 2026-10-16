import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function OrderConfirmation() {
  const navigate = useNavigate();

  const { clearCart } = useCart();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = sessionStorage.getItem(
      "englishLearningPendingOrder"
    );

    if (!savedOrder) {
      return;
    }

    try {
      const parsedOrder = JSON.parse(savedOrder);

      setOrder(parsedOrder);

      /*
        Clear the cart after the order information
        has been successfully created.

        Later this will happen only after successful payment.
      */

      clearCart();
    } catch (error) {
      console.error(
        "Could not load order:",
        error
      );
    }
  }, [clearCart]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-10 text-center shadow-sm">

          <div className="mb-4 text-5xl">
            📦
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Order Information Not Found
          </h1>

          <p className="mt-2 text-gray-600">
            This confirmation page does not have an order to display.
          </p>

          <button
            onClick={() => navigate("/shop")}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Return to Shop
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        <div className="rounded-xl bg-white p-8 shadow-sm md:p-10">

          {/* Success */}
          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <span className="text-4xl text-green-600">
                ✓
              </span>
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Order Confirmed!
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-gray-600">
              Thank you, {order.customer.firstName}.
              Your order information has been received.
            </p>

          </div>

          {/* Order Number */}
          <div className="mt-8 rounded-lg bg-gray-50 p-5 text-center">

            <p className="text-sm text-gray-500">
              Order Number
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              #{order.orderNumber}
            </p>

          </div>

          {/* Customer Information */}
          <div className="mt-6 rounded-lg border p-5">

            <h2 className="text-lg font-semibold text-gray-900">
              Customer Information
            </h2>

            <div className="mt-4 space-y-2 text-sm">

              <p>
                <span className="font-medium">
                  Name:
                </span>{" "}
                {order.customer.firstName}{" "}
                {order.customer.lastName}
              </p>

              <p>
                <span className="font-medium">
                  Email:
                </span>{" "}
                {order.customer.email}
              </p>

            </div>

          </div>

          {/* Purchased Products */}
          <div className="mt-6 rounded-lg border p-5">

            <h2 className="text-lg font-semibold text-gray-900">
              Order Items
            </h2>

            <div className="mt-4 space-y-4">

              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                >

                  <div>
                    <p className="font-medium text-gray-900">
                      {item.title}
                    </p>

                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                </div>
              ))}

            </div>

          </div>

          {/* Total */}
          <div className="mt-6 rounded-lg bg-blue-50 p-5">

            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>
                Order Total
              </span>

              <span>
                ${order.total.toFixed(2)}
              </span>
            </div>

          </div>

          {/* Next Steps */}
          <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-5">

            <h2 className="font-semibold text-gray-900">
              What's next?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Your order is currently a test order. Later we will
              connect Supabase and the payment system so that
              completed purchases are stored securely and your
              digital products become available in your account.
            </p>

          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Go to Dashboard
            </button>

            <button
              onClick={() => navigate("/shop")}
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Continue Shopping
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}