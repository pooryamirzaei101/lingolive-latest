import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function NewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadSubscribers() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading subscribers:", error);
      setMessage("Unable to load newsletter subscribers.");
      setLoading(false);
      return;
    }

    setSubscribers(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadSubscribers();
  }, []);

  async function toggleSubscriber(id, currentStatus) {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({
        is_active: !currentStatus,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating subscriber:", error);
      setMessage("Unable to update subscriber.");
      return;
    }

    setSubscribers((currentSubscribers) =>
      currentSubscribers.map((subscriber) =>
        subscriber.id === id
          ? {
              ...subscriber,
              is_active: !currentStatus,
            }
          : subscriber
      )
    );
  }

  async function deleteSubscriber(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subscriber?"
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting subscriber:", error);
      setMessage("Unable to delete subscriber.");
      return;
    }

    setSubscribers((currentSubscribers) =>
      currentSubscribers.filter(
        (subscriber) => subscriber.id !== id
      )
    );
  }

  const filteredSubscribers = subscribers.filter((subscriber) =>
    (subscriber.email || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Newsletter Subscribers
          </h2>

          <p className="text-gray-600 mt-2">
            Manage people subscribed to your newsletter.
          </p>
        </div>

        <div className="text-sm text-gray-600">
          Total:{" "}
          <span className="font-semibold text-gray-900">
            {subscribers.length}
          </span>
        </div>
      </div>

      {/* Search */}

      <div className="mb-6">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by email..."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Message */}

      {message && (
        <div className="mb-5 p-4 rounded-lg bg-red-50 text-red-700">
          {message}
        </div>
      )}

      {/* Loading */}

      {loading && (
        <div className="py-10 text-center text-gray-500">
          Loading subscribers...
        </div>
      )}

      {/* Empty */}

      {!loading && filteredSubscribers.length === 0 && (
        <div className="py-10 text-center text-gray-500">
          No subscribers found.
        </div>
      )}

      {/* Subscriber Table */}

      {!loading && filteredSubscribers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Name
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Email
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Date
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Status
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredSubscribers.map((subscriber) => (
                <tr
                  key={subscriber.id}
                  className="border-b last:border-b-0"
                >
                  <td className="px-4 py-4 text-gray-900">
                    {subscriber.name || "—"}
                  </td>

                  <td className="px-4 py-4 text-gray-900">
                    {subscriber.email}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {subscriber.created_at
                      ? new Date(
                          subscriber.created_at
                        ).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        subscriber.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {subscriber.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          toggleSubscriber(
                            subscriber.id,
                            subscriber.is_active
                          )
                        }
                        className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium"
                      >
                        {subscriber.is_active
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteSubscriber(subscriber.id)
                        }
                        className="px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}