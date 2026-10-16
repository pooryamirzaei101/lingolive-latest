import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-6">

      <h2 className="text-2xl font-bold mb-8">
        Admin Panel
      </h2>

      <nav className="space-y-3">

        <Link
          to="/admin"
          className="block p-3 rounded hover:bg-slate-700"
        >
          Dashboard
        </Link>

        <Link
          to="/admin/lessons"
          className="block p-3 rounded hover:bg-slate-700"
        >
          Lessons
        </Link>

        <Link
          to="/admin/courses"
          className="block p-3 rounded hover:bg-slate-700"
        >
          Courses
        </Link>

        <Link
          to="/admin/pdfs"
          className="block p-3 rounded hover:bg-slate-700"
        >
          PDFs
        </Link>

        <Link
          to="/admin/students"
          className="block p-3 rounded hover:bg-slate-700"
        >
          Students
        </Link>

        <Link
          to="/admin/orders"
          className="block p-3 rounded hover:bg-slate-700"
        >
          Orders
        </Link>

        <Link
          to="/admin/newsletter"
          className="block p-3 rounded hover:bg-slate-700"
        >
          Newsletter
        </Link>

        <Link
          to="/admin/settings"
          className="block p-3 rounded hover:bg-slate-700"
        >
          Settings
        </Link>

      </nav>

    </aside>
  );
}