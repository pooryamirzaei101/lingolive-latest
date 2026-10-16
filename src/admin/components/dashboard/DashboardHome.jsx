import QuickStatistics from "./QuickStatistics";
import ContinueLearning from "./ContinueLearning";
import MyCourses from "./MyCourses";
import RecentLessons from "./RecentLessons";
import Certificates from "./Certificates";
import ProfileSummary from "./ProfileSummary";

export default function DashboardHome() {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold">
          Student Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back! Continue your learning journey.
        </p>

      </div>

      {/* Statistics */}

      <QuickStatistics />

      {/* Continue Learning */}

      <ContinueLearning />

      {/* Main Dashboard */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left Side */}

        <div className="xl:col-span-2 space-y-6">

          <MyCourses />

          <RecentLessons />

        </div>

        {/* Right Side */}

        <div className="space-y-6">

          <ProfileSummary />

          <Certificates />

        </div>

      </div>

    </div>
  );
}