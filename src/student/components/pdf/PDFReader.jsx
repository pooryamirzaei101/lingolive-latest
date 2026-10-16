import PDFToolbar from "./PDFToolbar";
import PDFSidebar from "./PDFSidebar";
import PDFViewer from "./PDFViewer";

export default function PDFReader() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">

      {/* Toolbar */}

      <PDFToolbar />

      {/* Main Layout */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar */}

        <div className="lg:col-span-1">

          <PDFSidebar />

        </div>

        {/* PDF Viewer */}

        <div className="lg:col-span-3">

          <PDFViewer />

        </div>

      </div>

    </div>
  );
}