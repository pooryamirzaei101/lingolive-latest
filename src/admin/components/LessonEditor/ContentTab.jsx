export default function ContentTab({ lesson, setLesson }) {
  const updateField = (field, value) => {
    setLesson({
      ...lesson,
      [field]: value,
    });
  };

  const fields = [
    {
      label: "Lesson Description",
      field: "description",
      rows: 3,
      placeholder: "Short description..."
    },
    {
      label: "Lesson Content",
      field: "content",
      rows: 8,
      placeholder: "Write the complete lesson..."
    },
    {
      label: "Grammar Explanation",
      field: "grammar",
      rows: 6,
      placeholder: "Explain grammar..."
    },
    {
      label: "Vocabulary",
      field: "vocabulary",
      rows: 6,
      placeholder: "List important words..."
    },
    {
      label: "Examples",
      field: "examples",
      rows: 6,
      placeholder: "Example sentences..."
    },
    {
      label: "Transcript",
      field: "transcript",
      rows: 8,
      placeholder: "Video transcript..."
    },
    {
      label: "Translation",
      field: "translation",
      rows: 8,
      placeholder: "Lesson translation..."
    },
    {
      label: "Teacher Notes",
      field: "notes",
      rows: 5,
      placeholder: "Private notes..."
    }
  ];

  return (
    <div className="space-y-8">
      {fields.map((item) => (
        <div key={item.field}>
          <label className="block text-lg font-semibold mb-2">
            {item.label}
          </label>

          <textarea
            rows={item.rows}
            className="w-full border rounded-lg p-3"
            placeholder={item.placeholder}
            value={lesson[item.field] || ""}
            onChange={(e) =>
              updateField(item.field, e.target.value)
            }
          />
        </div>
      ))}
    </div>
  );
}