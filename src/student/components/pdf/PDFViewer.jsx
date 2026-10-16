export default function PDFViewer() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">

      {/* PDF Display Area */}

      <div className="bg-gray-100 min-h-[700px] flex items-center justify-center">

        <div className="text-center">

          <div className="text-8xl mb-6">
            📄
          </div>

          <h2 className="text-3xl font-bold mb-3">
            PDF Viewer
          </h2>

          <p className="text-gray-600 max-w-lg mx-auto">
            Lesson PDFs, eBooks, worksheets, and study materials
            will appear here after connecting the platform to
            Supabase Storage.
          </p>

        </div>

      </div>

      {/* Footer */}

      <div className="border-t p-5">

        <div className="flex flex-wrap justify-between items-center gap-4">

          <div>

            <h3 className="font-bold">
              English Grammar Workbook
            </h3>

            <p className="text-gray-500">
              156 Pages • PDF
            </p>

          </div>

          <div className="flex gap-6 text-center">

            <div>

              <p className="text-gray-500 text-sm">
                Current Page
              </p>

              <p className="font-bold">
                1
              </p>

            </div>

            <div>

              <p className="text-gray-500 text-sm">
                Total Pages
              </p>

              <p className="font-bold">
                156
              </p>

            </div>

            <div>

              <p className="text-gray-500 text-sm">
                Reading Time
              </p>

              <p className="font-bold">
                45 min
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}