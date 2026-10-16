import { Link, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import { getLessons } from "../admin/data/lessonStore";

const titleCase = (value = "") => value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function LessonLibrary({ category }) {
  const { level } = useParams();
  const lessons = getLessons().filter((lesson) => lesson.category?.toLowerCase() === category.toLowerCase() && (!level || lesson.level?.toLowerCase() === level.toLowerCase()) && lesson.status === "Published");
  const heading = `${level ? `${titleCase(level)} ` : ""}${category} Lessons`;
  return <div className="mx-auto min-h-screen max-w-5xl px-6 py-10"><BackButton /><header className="mt-6 rounded-2xl bg-white p-8 shadow-lg"><h1 className="text-4xl font-bold">{heading}</h1><p className="mt-3 text-gray-600">Choose a published lesson and learn at your own pace.</p></header><section className="mt-8 grid gap-5 md:grid-cols-2">{lessons.map((lesson) => <article key={lesson.id} className="rounded-xl bg-white p-6 shadow"><p className="text-sm font-semibold text-blue-600">{lesson.level}</p><h2 className="mt-2 text-2xl font-bold">{lesson.title}</h2><p className="mt-3 text-gray-600">{lesson.description || "A guided English lesson."}</p><Link to={`/lessons/${lesson.id}`} className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">Open lesson</Link></article>)}</section>{!lessons.length && <p className="mt-8 rounded-xl border-2 border-dashed p-8 text-center text-gray-600">No published lessons are available here yet.</p>}</div>;
}
