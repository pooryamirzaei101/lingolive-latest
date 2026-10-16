import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import { getLessons } from "../admin/data/lessonStore";

export default function Lesson() {
  const { lessonId } = useParams();
  const lesson = getLessons().find((item) => String(item.id) === lessonId);
  if (!lesson) return <div className="mx-auto max-w-4xl p-10"><BackButton /><p className="mt-8 text-xl">This lesson could not be found.</p></div>;
  return <article className="mx-auto min-h-screen max-w-4xl px-6 py-10"><BackButton /><header className="mt-6 rounded-2xl bg-white p-8 shadow"><p className="font-semibold text-blue-600">{lesson.category} · {lesson.level}</p><h1 className="mt-2 text-4xl font-bold">{lesson.title}</h1><p className="mt-4 text-gray-600">{lesson.description}</p></header><section className="mt-8 space-y-5 rounded-2xl bg-white p-8 shadow"><p className="whitespace-pre-wrap leading-8">{lesson.content || "Your teacher will add the lesson content soon."}</p>{(lesson.blocks || []).map((block) => <div key={block.id} className="rounded-lg border p-4"><h2 className="font-bold">{block.type}</h2><p className="mt-2 whitespace-pre-wrap">{block.content}</p></div>)}</section></article>;
}
