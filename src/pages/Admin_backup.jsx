import StatisticsCards from "../admin/components/dashboard/StatisticsCards";
import QuickActions from "../admin/components/dashboard/QuickActions";
import RecentActivity from "../admin/components/dashboard/RecentActivity";
import DashboardCharts from "../admin/components/dashboard/DashboardCharts";

import LessonForm from "../admin/LessonForm";
import LessonTable from "../admin/components/LessonTable";
import LessonEditor from "../admin/components/LessonEditor/LessonEditor";

export default function Admin() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {/* ================= Header ================= */}

      <header>
        <h1 className="text-5xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-600 mt-3">
          Manage your English Learning Platform
        </p>
      </header>

      {/* ================= Dashboard ================= */}

      <StatisticsCards />

      <QuickActions />

      <RecentActivity />

      <DashboardCharts />

      {/* ================= Lesson Management ================= */}

      <section className="bg-white rounded-xl shadow-lg p-8">

        <h2 className="text-3xl font-bold mb-6">
          Create New Lesson
        </h2>

        <LessonForm />

      </section>

      {/* ================= Lesson Editor ================= */}

      <section className="bg-white rounded-xl shadow-lg p-8">

        <h2 className="text-3xl font-bold mb-6">
          Professional Lesson Editor
        </h2>

        <LessonEditor />

      </section>

      {/* ================= Lesson Library ================= */}

      <section className="bg-white rounded-xl shadow-lg p-8">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-3xl font-bold">
            Lesson Library
          </h2>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
            + New Lesson
          </button>

        </div>

        <LessonTable />

      </section>

    </div>
  );
}