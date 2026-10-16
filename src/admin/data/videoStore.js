const STORAGE_KEY = "english-learning-videos";

export function getYouTubeId(value = "") {
  const match = value.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return match ? match[1] : "";
}

export function getVideos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveVideos(videos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
}

export function createVideo({ title, url, description }) {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    url: url.trim(),
    youtubeId: getYouTubeId(url),
    description: description.trim(),
    createdAt: new Date().toISOString(),
  };
}
