import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Checkout() {
  const {
    cartItems,
    cartSubtotal,
  } = useCart();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  }

  function validateForm() {
    const newErrors = {};

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim();

    if (!firstName) {
      newErrors.firstName = "First name is required.";
    }

    if (!lastName) {
      newErrors.lastName = "Last name is required.";
    }

    if (!email) {
      newErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    /*
      Create a temporary order object.

      This is NOT the final database order.
      Later Supabase will create and store the real order.
    */

    const order = {
      orderNumber: `ORDER-${Date.now()}`,
      customer: {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
      },
      items: cartItems,
      subtotal: cartSubtotal,
      total: cartSubtotal,
      createdAt: new Date().toISOString(),
    };

    /*
      Save temporary order information in sessionStorage.

      This allows the confirmation page to read the
      order after navigation.
    */

    sessionStorage.setItem(
      "englishLearningPendingOrder",
      JSON.stringify(order)
    );

    navigate("/order-confirmation");
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-10 text-center shadow-sm">

          <div className="mb-4 text-5xl">
            🛒
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-2 text-gray-600">
            Add a product to your cart before checkout.
          </p>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Continue Shopping
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Checkout
          </h1>

          <p className="mt-2 text-gray-600">
            Review your order before completing your purchase.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">

            {/* Left Side */}
            <div className="lg:col-span-2">

              {/* Customer Information */}
              <div className="rounded-xl bg-white p-6 shadow-sm">

                <h2 className="text-xl font-semibold text-gray-900">
                  Customer Information
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">

                  {/* First Name */}
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                      className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500 ${
                        errors.firstName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />

                    {errors.firstName && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500 ${
                        errors.lastName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />

                    {errors.lastName && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500 ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />

                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}

                    <p className="mt-2 text-sm text-gray-500">
                      Your purchase information will be associated
                      with this email address.
                    </p>
                  </div>

                </div>
              </div>

              {/* Payment Placeholder */}
              <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

                <h2 className="text-xl font-semibold text-gray-900">
                  Payment
                </h2>

                <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">

                  <p className="font-medium text-gray-800">
                    Payment system coming next
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    We will connect the payment system after
                    the order structure is complete.
                  </p>

                </div>

              </div>

            </div>

            {/* Right Side — Order Summary */}
            <div className="h-fit rounded-xl bg-white p-6 shadow-sm">

              <h2 className="text-xl font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-4"
                  >

                    <div>
                      <p className="font-medium text-gray-900">
                        {item.title}
                      </p>

                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                  </div>
                ))}

                <div className="border-t pt-4">

                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>
                      Total
                    </span>

                    <span>
                      ${cartSubtotal.toFixed(2)}
                    </span>
                  </div>

                </div>

              </div>

              {/* Continue to Payment */}
              <button
                type="submit"
                className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Continue to Payment
              </button>

              {/* Back to Cart */}
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="mt-3 w-full rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Back to Cart
              </button>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
}