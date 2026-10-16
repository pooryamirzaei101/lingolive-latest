import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    dailyLessons: true,
    courseReminders: true,
    marketingEmails: false,
    language: "English",
    theme: "Light",
  });

  const [message, setMessage] = useState("");

  const updateSetting = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));

    setMessage("");
  };

  const handleSave = (e) => {
    e.preventDefault();

    console.log("Settings:", settings);

    setMessage(
      "Settings are ready to be saved. They will be connected to your user account in Phase 7."
    );
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Account Settings"
        subtitle="Customize your learning experience."
      >
        <form onSubmit={handleSave}>

          {/* Notifications */}

          <div className="mb-8">

            <h2 className="text-xl font-bold mb-4">
              Notifications
            </h2>

            <div className="space-y-4">

              <label className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    Email Notifications
                  </p>

                  <p className="text-sm text-gray-500">
                    Receive important account notifications.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    updateSetting(
                      "emailNotifications",
                      e.target.checked
                    )
                  }
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    Daily Lessons
                  </p>

                  <p className="text-sm text-gray-500">
                    Receive your daily English lesson.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={settings.dailyLessons}
                  onChange={(e) =>
                    updateSetting(
                      "dailyLessons",
                      e.target.checked
                    )
                  }
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    Course Reminders
                  </p>

                  <p className="text-sm text-gray-500">
                    Get reminders about unfinished courses.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={settings.courseReminders}
                  onChange={(e) =>
                    updateSetting(
                      "courseReminders",
                      e.target.checked
                    )
                  }
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    Marketing Emails
                  </p>

                  <p className="text-sm text-gray-500">
                    Receive news, offers, and platform updates.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={settings.marketingEmails}
                  onChange={(e) =>
                    updateSetting(
                      "marketingEmails",
                      e.target.checked
                    )
                  }
                  className="w-5 h-5"
                />
              </label>

            </div>

          </div>

          {/* Language */}

          <div className="mb-6">

            <label className="block font-semibold mb-2">
              Interface Language
            </label>

            <select
              value={settings.language}
              onChange={(e) =>
                updateSetting("language", e.target.value)
              }
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="English">
                English
              </option>

              <option value="Persian">
                Persian
              </option>
            </select>

          </div>

          {/* Theme */}

          <div className="mb-8">

            <label className="block font-semibold mb-2">
              Theme
            </label>

            <select
              value={settings.theme}
              onChange={(e) =>
                updateSetting("theme", e.target.value)
              }
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Light">
                Light
              </option>

              <option value="Dark">
                Dark
              </option>

              <option value="System">
                System Default
              </option>
            </select>

          </div>

          {message && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Save Settings
          </button>

        </form>
      </AuthCard>
    </AuthLayout>
  );
}