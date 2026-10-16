import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";

export default function Dashboard() {
  const navigate = useNavigate();

  const { user, logout, loading } = useAuth();

  const [order, setOrder] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    try {
      const savedOrder = sessionStorage.getItem(
        "englishLearningPendingOrder"
      );

      if (savedOrder) {
        setOrder(JSON.parse(savedOrder));
      }
    } catch (error) {
      console.error("Could not load order:", error);
    }
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const result = await logout();

      if (result?.success) {
        navigate("/login", { replace: true });
        return;
      }

      console.error(result?.error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <BackButton />
        </div>

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            Student Area
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Student Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Welcome back to your English Learning Platform.
          </p>

          {user?.email && (
            <div className="mt-5 inline-flex rounded-lg bg-blue-100 px-4 py-2">
              <span className="text-blue-700 font-medium">
                {user.email}
              </span>
            </div>
          )}
        </div>

        {/* Statistics */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="My Courses"
            value="0"
          />

          <StatCard
            title="Lessons Completed"
            value="0"
          />

          <StatCard
            title="Orders"
            value={order ? "1" : "0"}
          />

          <StatCard
            title="Progress"
            value="0%"
          />

        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">

          {/* Main */}

          <div className="space-y-8 lg:col-span-2">

            <section className="rounded-xl bg-white p-6 shadow">

              <h2 className="text-2xl font-bold">
                Continue Learning
              </h2>

              <p className="mt-2 text-gray-500">
                Continue your latest lessons.
              </p>

              <div className="mt-6 rounded-lg border-2 border-dashed p-8 text-center">

                <div className="text-5xl">
                  📚
                </div>

                <h3 className="mt-4 text-xl font-semibold">
                  No Courses Yet
                </h3>

                <button
                  onClick={() => navigate("/shop")}
                  className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                >
                  Browse Shop
                </button>

              </div>

            </section>

            <section className="rounded-xl bg-white p-6 shadow">

              <h2 className="text-2xl font-bold">
                My Orders
              </h2>

              {order ? (
                <div className="mt-5 rounded-lg border p-5">

                  <p>
                    <strong>Order:</strong>{" "}
                    {order.orderNumber || "N/A"}
                  </p>

                  <p className="mt-2">
                    <strong>Total:</strong> $
                    {order.total || 0}
                  </p>

                </div>
              ) : (
                <p className="mt-5 text-gray-500">
                  No orders found.
                </p>
              )}

            </section>

          </div>

          {/* Sidebar */}

          <div className="space-y-8">

            <section className="rounded-xl bg-white p-6 shadow">

              <h2 className="text-2xl font-bold">
                Profile
              </h2>

              <p className="mt-4 break-all text-gray-600">
                {user?.email || "Guest"}
              </p>

              <button
                onClick={() => navigate("/profile")}
                className="mt-6 w-full rounded-lg border px-4 py-3 hover:bg-gray-50"
              >
                View Profile
              </button>

            </section>

            <section className="rounded-xl bg-white p-6 shadow">

              <h2 className="text-2xl font-bold">
                Account
              </h2>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="mt-6 w-full rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loggingOut
                  ? "Logging Out..."
                  : "Logout"}
              </button>

            </section>

          </div>

        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}
