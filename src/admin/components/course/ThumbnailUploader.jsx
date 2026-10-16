export default function ThumbnailUploader({ course, setCourse }) {
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setCourse({
      ...course,
      thumbnail: imageUrl,
    });
  };

  return (
    <div className="mt-8">

      <label className="block font-semibold mb-3">
        Course Thumbnail
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleImage}
      />

      {course.thumbnail && (

        <div className="mt-5">

          <img
            src={course.thumbnail}
            alt="Thumbnail Preview"
            className="w-72 rounded-lg border shadow"
          />

        </div>

      )}

    </div>
  );
}