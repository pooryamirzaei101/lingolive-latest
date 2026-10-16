import { useState } from "react";

export default function PublishSettings() {
  const [settings, setSettings] = useState({
    status: "draft",
    visibility: "public",
    featured: false,
    certificate: true,
    language: "English",
    enrollmentLimit: "",
    publishDate: "",
    seoUrl: "",
    seoTitle: "",
    metaDescription: "",
  });

  const updateField = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">

      <h2 className="text-2xl font-bold mb-8">
        Publish Settings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Status */}

        <div>

          <label className="block font-semibold mb-2">
            Course Status
          </label>

          <select
            className="w-full border rounded-lg p-3"
            value={settings.status}
            onChange={(e) =>
              updateField("status", e.target.value)
            }
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>

        </div>

        {/* Visibility */}

        <div>

          <label className="block font-semibold mb-2">
            Visibility
          </label>

          <select
            className="w-full border rounded-lg p-3"
            value={settings.visibility}
            onChange={(e) =>
              updateField("visibility", e.target.value)
            }
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="unlisted">Unlisted</option>
          </select>

        </div>

        {/* Language */}

        <div>

          <label className="block font-semibold mb-2">
            Course Language
          </label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            value={settings.language}
            onChange={(e) =>
              updateField("language", e.target.value)
            }
          />

        </div>

        {/* Enrollment */}

        <div>

          <label className="block font-semibold mb-2">
            Enrollment Limit
          </label>

          <input
            type="number"
            className="w-full border rounded-lg p-3"
            value={settings.enrollmentLimit}
            onChange={(e) =>
              updateField("enrollmentLimit", e.target.value)
            }
          />

        </div>

        {/* Publish Date */}

        <div>

          <label className="block font-semibold mb-2">
            Publish Date
          </label>

          <input
            type="date"
            className="w-full border rounded-lg p-3"
            value={settings.publishDate}
            onChange={(e) =>
              updateField("publishDate", e.target.value)
            }
          />

        </div>

        {/* SEO URL */}

        <div>

          <label className="block font-semibold mb-2">
            SEO URL
          </label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            placeholder="/courses/ielts-master"
            value={settings.seoUrl}
            onChange={(e) =>
              updateField("seoUrl", e.target.value)
            }
          />

        </div>

      </div>

      {/* Checkboxes */}

      <div className="flex gap-8 mt-8">

        <label className="flex items-center gap-2">

          <input
            type="checkbox"
            checked={settings.featured}
            onChange={(e) =>
              updateField("featured", e.target.checked)
            }
          />

          Featured Course

        </label>

        <label className="flex items-center gap-2">

          <input
            type="checkbox"
            checked={settings.certificate}
            onChange={(e) =>
              updateField("certificate", e.target.checked)
            }
          />

          Certificate Enabled

        </label>

      </div>

      {/* SEO */}

      <div className="mt-8">

        <label className="block font-semibold mb-2">
          SEO Title
        </label>

        <input
          type="text"
          className="w-full border rounded-lg p-3"
          value={settings.seoTitle}
          onChange={(e) =>
            updateField("seoTitle", e.target.value)
          }
        />

      </div>

      <div className="mt-6">

        <label className="block font-semibold mb-2">
          Meta Description
        </label>

        <textarea
          rows="4"
          className="w-full border rounded-lg p-3"
          value={settings.metaDescription}
          onChange={(e) =>
            updateField("metaDescription", e.target.value)
          }
        />

      </div>

    </div>
  );
}