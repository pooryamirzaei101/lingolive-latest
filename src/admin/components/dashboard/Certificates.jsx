export default function Certificates() {
  const certificates = [
    {
      id: 1,
      course: "English Grammar Masterclass",
      date: "15 Jun 2026",
    },
    {
      id: 2,
      course: "Basic Conversation English",
      date: "28 May 2026",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Certificates
        </h2>

        <button className="text-blue-600 hover:text-blue-700 font-semibold">
          View All
        </button>

      </div>

      {certificates.length === 0 ? (

        <p className="text-gray-500">
          No certificates earned yet.
        </p>

      ) : (

        <div className="space-y-4">

          {certificates.map((certificate) => (

            <div
              key={certificate.id}
              className="border rounded-xl p-4"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h3 className="font-bold text-lg">
                    🏆 {certificate.course}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Completed on {certificate.date}
                  </p>

                </div>

              </div>

              <div className="flex gap-3 mt-4">

                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                >
                  Download
                </button>

                <button
                  className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-lg"
                >
                  Share
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      <div className="mt-8">

        <p className="font-semibold mb-2">
          Next Certificate Progress
        </p>

        <div className="w-full bg-gray-200 rounded-full h-3">

          <div
            className="bg-green-600 h-3 rounded-full"
            style={{ width: "72%" }}
          />

        </div>

        <p className="text-sm text-gray-500 mt-2">
          72% completed
        </p>

      </div>

    </div>
  );
}