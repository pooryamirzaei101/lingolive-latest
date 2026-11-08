export const mediaSections = {
  lessons: 'Lessons', video: 'Video Lessons', news: 'News', daily: 'Daily Lessons',
  youtube: 'YouTube Lessons', podcast: 'Podcasts',
  'ielts-listening-reading': 'IELTS Listening & Reading',
  'ielts-video-speaking': 'IELTS Video Speaking', speaking: 'Speaking Practice',
} as const;
export type MediaSection = keyof typeof mediaSections;
export function validateMediaSections(value: unknown): MediaSection[] {
  if (!Array.isArray(value) || value.length > Object.keys(mediaSections).length ||
    value.some(v => typeof v !== 'string' || !Object.hasOwn(mediaSections, v))) {
    throw Error('Choose valid lesson sections.');
  }
  return [...new Set(value)] as MediaSection[];
}
export function savedMediaSections(raw: string): MediaSection[] {
  try { return validateMediaSections(JSON.parse(raw)); } catch { return []; }
}
