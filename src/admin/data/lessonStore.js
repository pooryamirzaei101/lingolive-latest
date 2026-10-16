import starterLessons from "./lessons";

const STORAGE_KEY = "english-learning-lessons";

export function getLessons() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : starterLessons;
  } catch {
    return starterLessons;
  }
}

export function saveLessons(lessons) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
}

export function createLesson(values) {
  return {
    id: crypto.randomUUID(),
    title: values.title.trim(),
    category: values.category,
    level: values.level,
    description: values.description.trim(),
    content: values.content || "",
    blocks: values.blocks || [],
    status: values.status || "Draft",
    createdAt: new Date().toISOString(),
  };
}
