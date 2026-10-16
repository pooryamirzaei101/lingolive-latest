import StatisticsCards from "../admin/components/dashboard/StatisticsCards";
import QuickActions from "../admin/components/dashboard/QuickActions";
import RecentActivity from "../admin/components/dashboard/RecentActivity";
import DashboardCharts from "../admin/components/dashboard/DashboardCharts";

import CourseEditor from "../admin/components/course/CourseEditor";
import CourseLibrary from "../admin/components/course/library/CourseLibrary";

import LessonTable from "../admin/components/LessonTable";

import NewsletterSubscribers from "../components/NewsletterSubscribers/NewsletterSubscribers";
import LessonBuilder from "../admin/lesson-builder/LessonBuilder";
import { createLesson, getLessons, saveLessons } from "../admin/data/lessonStore";
import VideoManager from "../admin/components/VideoManager";
import { getVideos, saveVideos } from "../admin/data/videoStore";
import { useState } from "react";

export default function Admin() {
  const [lessons, setLessons] = useState(getLessons);
  const [videos, setVideos] = useState(getVideos);
  const addLesson = (values) => {
    const next = [createLesson(values), ...lessons];
    setLessons(next);
    saveLessons(next);
  };
  const toggleStatus = (id) => {
    const next = lessons.map((lesson) => lesson.id === id ? { ...lesson, status: lesson.status === "Published" ? "Draft" : "Published" } : lesson);
    setLessons(next);
    saveLessons(next);
  };
  const deleteLesson = (id) => {
    if (!window.confirm("Delete this lesson?")) return;
    const next = lessons.filter((lesson) => lesson.id !== id);
    setLessons(next);
    saveLessons(next);
  };
  const addVideo = (video) => {
    const next = [video, ...videos];
    setVideos(next);
    saveVideos(next);
  };
  const deleteVideo = (id) => {
    const next = videos.filter((video) => video.id !== id);
    setVideos(next);
    saveVideos(next);
  };
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

      <VideoManager videos={videos} onAdd={addVideo} onDelete={deleteVideo} />

      <RecentActivity />

      <DashboardCharts />


      {/* ================= Create Course ================= */}

      <section
        id="course-editor"
        className="bg-white rounded-xl shadow-lg p-8"
      >

        <h2 className="text-3xl font-bold mb-6">
          Create Course
        </h2>

        <CourseEditor />

      </section>


      {/* ================= Course Library ================= */}

      <section className="bg-white rounded-xl shadow-lg p-8">

        <CourseLibrary />

      </section>


      {/* ================= Create Lesson ================= */}

      <section
        id="lesson-form"
        className="bg-white rounded-xl shadow-lg p-8"
      >

        <h2 className="text-3xl font-bold mb-6">
          Create New Lesson
        </h2>

        <LessonBuilder onSave={addLesson} />

      </section>


      {/* ================= Professional Lesson Editor ================= */}

      <section className="bg-white rounded-xl shadow-lg p-8">

        <h2 className="text-3xl font-bold mb-6">
          Professional Lesson Editor
        </h2>

        <p className="text-gray-600">The block builder above is the active editor. The older editor remains in the codebase for later migration.</p>

      </section>


      {/* ================= Lesson Library ================= */}

      <section className="bg-white rounded-xl shadow-lg p-8">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-3xl font-bold">
            Lesson Library
          </h2>


          <button
            type="button"
            onClick={() =>
              document
                .getElementById("lesson-form")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            + New Lesson
          </button>

        </div>


          <LessonTable lessons={lessons} onDelete={deleteLesson} onToggleStatus={toggleStatus} />

      </section>


      {/* ================= Newsletter Subscribers ================= */}

      <section className="bg-white rounded-xl shadow-lg p-8">

        <NewsletterSubscribers />

      </section>


    </div>
  );
}
