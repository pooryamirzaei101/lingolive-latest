import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function NewsletterSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setIsSuccess(false);

    if (!name.trim() || !email.trim()) {
      setMessage("Please enter your name and email address.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([
          {
            email: email.trim().toLowerCase(),
          },
        ]);

      if (error) {
        if (error.code === "23505") {
          setMessage("This email address is already subscribed.");
        } else {
          console.error("Newsletter subscription error:", error);
          setMessage(
            "Something went wrong. Please try again later."
          );
        }

        return;
      }

      setIsSuccess(true);
      setMessage(
        `Thanks ${name.trim()}! You are now subscribed to our newsletter.`
      );

      setName("");
      setEmail("");
    } catch (error) {
      console.error("Unexpected newsletter error:", error);
      setMessage(
        "Something went wrong. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-gray-50 border rounded-2xl p-8 shadow-sm">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Join Our Newsletter
            </h2>

            <p className="text-gray-600">
              Subscribe to receive useful English learning
              content directly in your inbox.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label
                htmlFor="newsletter-name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Name
              </label>

              <input
                id="newsletter-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="newsletter-email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>

              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            {/* Subscribe */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </button>

          </form>

          {/* Message */}
          {message && (
            <div
              className={`mt-5 p-4 rounded-lg text-sm ${
                isSuccess
                  ? "bg-green-50 text-green-700"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {message}
            </div>
          )}

          <p className="text-xs text-gray-500 text-center mt-5">
            You can unsubscribe at any time.
          </p>

        </div>
      </div>
    </section>
  );
}