const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function load(file, stubs = {}) {
  const module = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, {
    module, exports: module.exports, require: name => name in stubs ? stubs[name] : require(name),
    Request, Response, Headers, FormData, File, URL, URLSearchParams, Date, console,
    crypto: require('node:crypto').webcrypto,
  });
  return module.exports;
}

const youtube = load('lib/youtube.ts');
const transcript = load('lib/transcript-import.ts');
const video = load('lib/video.ts');
const categories = {
  video: [{ id: 'video-general', section: 'video' }, { id: 'news', section: 'video' }],
  speaking: [{ id: 'speaking-general', section: 'speaking' }],
  youtube: [{ id: 'youtube-general', section: 'youtube' }],
  podcast: [{ id: 'podcast-general', section: 'podcast' }],
};
let admin = true, lesson = null, allowed = true, mediaWrites = 0;
const db = {
  select: () => ({ from: table => ({ where: () => ({ get: async () => table === 'jobs' ? null : lesson, all: async () => [] }) }) }),
  insert: () => ({ values: values => { lesson = { ...values, status: 'draft' }; return {}; } }),
  update: () => ({ set: values => ({ where: async () => { Object.assign(lesson, values); } }) }),
};
const common = {
  '@/db': { getDb: () => db, getMediaBucket: () => ({ put: async () => { mediaWrites++; }, delete: async () => {} }) },
  '@/db/schema': { videoLessons: 'lessons', transcriptJobs: 'jobs', savedSentences: {} },
  '@/lib/admin': { isAdmin: async () => admin },
  '@/lib/video-categories': { getVideoCategories: async section => categories[section] },
  '@/lib/youtube': youtube,
  '@/lib/transcript-import': transcript,
  '@/lib/plain-script': load('lib/plain-script.ts'),
  '@/lib/thumbnails': { validVideoFormat: value => ['landscape', 'vertical', 'square'].includes(value) },
  '@/lib/podcast-media': { audioTypes: ['audio/mpeg'], videoTypes: ['video/mp4'] },
  '@/lib/languages': load('lib/languages.ts'),
  '@/lib/admin-media': { stagedMedia: async () => null },
};
const create = load('app/api/admin/video-lessons/route.ts', common);
const edit = load('app/api/admin/video-lessons/[id]/route.ts', { ...common, '@/lib/video': video });
function form(section, folder, sourceUrl = 'https://youtu.be/abcdefghijk', source = 'youtube') {
  const body = new FormData();
  for (const [key, value] of Object.entries({ title: 'A learning video', contentKind: section, category: folder, sourceUrl, videoSource: source, transcriptMode: 'manual' })) body.set(key, value);
  return body;
}
const post = (body, origin) => create.POST(new Request('https://test/api/admin/video-lessons', { method: 'POST', body, headers: origin ? { origin } : {} }));
const patch = body => edit.PATCH(new Request('https://test/api/admin/video-lessons/lesson', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }), { params: Promise.resolve({ id: 'lesson' }) });

(async () => {
  for (const [section, folder] of [['video', 'video-general'], ['video', 'news'], ['speaking', 'speaking-general'], ['youtube', 'youtube-general']]) {
    assert.equal((await post(form(section, folder))).status, 201);
    assert.equal(lesson.contentKind, section);
    assert.equal(lesson.category, folder);
    assert.equal(lesson.sourceUrl, 'https://www.youtube.com/embed/abcdefghijk');
    assert.equal(lesson.mediaKey, '');
    assert.equal(lesson.status, 'draft');
  }
  assert.equal(mediaWrites, 0, 'YouTube URLs must not upload or download video files');
  assert.equal((await post(form('video', 'speaking-general'))).status, 400);
  for (const url of ['https://evil.example/watch?v=abcdefghijk', 'javascript:alert(1)', 'https://youtube.com/watch?v=bad']) assert.equal((await post(form('video', 'news', url))).status, 400);
  assert.equal((await post(form('podcast', 'podcast-general'))).status, 400);
  assert.equal((await post(form('video', 'news', '', 'unknown'))).status, 400);
  assert.equal((await post(form('video', 'news'), 'https://other.example')).status, 403);
  admin = false;
  assert.equal((await post(form('video', 'news'))).status, 403);
  assert.equal((await patch({ category: 'news', contentKind: 'video' })).status, 403);
  admin = true;
  await post(form('youtube', 'youtube-general'));
  const originalUrl = lesson.sourceUrl;
  assert.equal((await patch({ category: 'news', contentKind: 'video' })).status, 200);
  assert.equal(lesson.contentKind, 'video');
  assert.equal(lesson.sourceUrl, originalUrl);
  assert.equal((await patch({ category: 'speaking-general', contentKind: 'speaking' })).status, 200);
  assert.equal((await patch({ status: 'published' })).status, 400, 'YouTube speaking requires a reviewed transcript');
  assert.equal((await patch({ category: 'podcast-general', contentKind: 'podcast' })).status, 400);
  lesson = { ...lesson, contentKind: 'video', sourceUrl: null, mediaKey: 'uploaded-video' };
  assert.equal((await patch({ category: 'youtube-general', contentKind: 'youtube' })).status, 400);
  const uploaded = form('video', 'video-general', '', 'upload');
  uploaded.set('video', new File(['video'], 'lesson.mp4', { type: 'video/mp4' }));
  assert.equal((await post(uploaded)).status, 201);
  assert.equal(lesson.sourceUrl, null);
  assert.equal(mediaWrites, 1);
  console.log('PASS: YouTube drafts in four destinations, canonical URLs, no media uploads, category/source validation, admin/origin checks, safe moves, transcript publication guard, existing video uploads.');

  const media = load('lib/lesson-media.ts', { ...common, '@/lib/video': video, '@/lib/membership': { canLearn: async () => allowed } });
  lesson = { ...lesson, contentKind: 'speaking', sourceUrl: originalUrl, transcriptionKey: 'owned-original', transcript: '[]' };
  const source = await media.lessonMedia('video', 'lesson', true);
  assert.equal(source.contentKind, 'youtube');
  assert.equal(source.mediaKey, 'owned-original');
  lesson.transcriptionKey = '';
  assert.equal((await media.lessonMedia('video', 'lesson', true)).mediaKey, '');

  const Player = props => React.createElement('div', { 'data-player': 'youtube', 'data-speaking': props.speakingMode, 'data-record': props.canRecord });
  const page = load('app/video-lessons/[id]/page.tsx', {
    ...common, '@/lib/membership': { canLearn: async () => allowed }, '@/lib/video': video,
    '@/components/membership-lock': { MembershipLock: () => React.createElement('div', null, 'Membership required') },
    '@/lib/translation-service': { preferredLanguage: async () => 'fa' },
    'next/navigation': { notFound: () => { throw Error('Not found'); } },
    '@/app/chatgpt-auth': { getChatGPTUser: async () => null },
    '@/components/video-learning-player': { VideoLearningPlayer: () => React.createElement('div', { 'data-player': 'upload' }) },
    '@/components/youtube-learning-lesson': { YouTubeLearningLesson: Player },
    '@/lib/video-example': { videoExample: {}, newsExample: {}, speakingVideoExample: {} },
    '@/lib/sample-visibility': { isSampleHidden: async () => false },
  });
  lesson.status = 'published';
  for (const kind of ['video', 'speaking', 'youtube']) {
    lesson.contentKind = kind;
    lesson.category = categories[kind][0].id;
    const markup = renderToStaticMarkup(await page.default({ params: Promise.resolve({ id: 'lesson' }), searchParams: Promise.resolve({}) }));
    assert.match(markup, /data-player="youtube"/);
    if (kind === 'speaking') assert.match(markup, /data-record="true"/);
  }
  allowed = false;
  const locked = renderToStaticMarkup(await page.default({ params: Promise.resolve({ id: 'lesson' }), searchParams: Promise.resolve({}) }));
  assert.match(locked, /Membership required/);
  assert.doesNotMatch(locked, /data-player/);
  const catalog = load('app/[section]/page.tsx', {
    'next/link': {},
    'next/navigation': { notFound: () => { throw Error('Not found'); }, redirect: () => { throw Error('Unexpected redirect'); } },
    '@/lib/section-folders': load('lib/section-folders.ts'),
    '@/components/section-folder-catalog': { SectionFolderCatalog: props => React.createElement('div', { 'data-section': props.slug }) },
  });
  const catalogMarkup = renderToStaticMarkup(await catalog.default({ params: Promise.resolve({ section: 'youtube-videos' }) }));
  assert.match(catalogMarkup, /data-section="youtube-videos"/);
  console.log('PASS: original transcription source selection, YouTube student player in all three video sections, speaking recording, membership enforcement, YouTube catalog without Flashcards redirect. No external calls.');
})().catch(error => { console.error(error); process.exit(1); });
