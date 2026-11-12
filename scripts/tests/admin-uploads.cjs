const ts = require('typescript');
const vm = require('node:vm');
const fs = require('node:fs/promises');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
async function load(file, stubs = {}, globals = {}) {
  const module = { exports: {} };
  const source = ts.transpileModule(await fs.readFile(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports,
    require: name => name in stubs ? stubs[name] : require(name),
    process, crypto: require('node:crypto').webcrypto, Uint8Array, ArrayBuffer,
    Blob, File, URLSearchParams, ...globals });
  return module.exports;
}
(async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lingolive-upload-'));
  const previous = process.env.MEDIA_ROOT;
  process.env.MEDIA_ROOT = root;
  try {
    const { getVpsMediaStore } = await load('lib/vps-media-store.ts');
    const store = getVpsMediaStore();
    const upload = await store.createMultipartUpload('staged/audio/test', { httpMetadata: { contentType: 'audio/mpeg' } });
    const first = await upload.uploadPart(1, new Uint8Array([1, 2]));
    const second = await upload.uploadPart(2, new Uint8Array([3, 4, 5]));
    const wrong = store.resumeMultipartUpload('staged/audio/other', upload.uploadId);
    await assert.rejects(wrong.uploadPart(1, new Uint8Array([9])), /does not match/);
    await assert.rejects(wrong.complete([first]), /does not match/);
    await assert.rejects(wrong.abort(), /does not match/);
    await assert.rejects(upload.complete([second]), /Incomplete/);
    await assert.rejects(upload.complete([{ ...first, etag: 'wrong' }]), /does not match/);
    await assert.rejects(fs.stat(path.join(root, 'staged/audio/test')), { code: 'ENOENT' });
    assert.equal((await upload.complete([first, second])).size, 5);
    assert.deepEqual([...await fs.readFile(path.join(root, 'staged/audio/test'))], [1, 2, 3, 4, 5]);
    assert.equal((await store.head('staged/audio/test')).httpMetadata.contentType, 'audio/mpeg');
    await assert.rejects(upload.uploadPart(1, new Uint8Array([9])), { code: 'ENOENT' });
    const aborted = await store.createMultipartUpload('staged/video/test');
    await aborted.abort();
    await assert.rejects(aborted.uploadPart(1, new Uint8Array([9])), { code: 'ENOENT' });

    const events = [];
    let settle;
    const pending = new Promise(resolve => { settle = resolve; });
    const { uploadAdminMedia } = await load('lib/admin-upload-client.ts', {
      '@/lib/podcast-media': { audioUploadMime: () => 'audio/mpeg', podcastMime: () => 'video/mp4' },
    }, { fetch: async (url, options) => {
      if (url === '/api/admin/media-uploads') return Response.json({ key: 'staged/audio/test', uploadId: 'session', partSize: 2 });
      if (options.method === 'PUT') {
        const part = new URL(url, 'https://test').searchParams.get('partNumber');
        events.push(`start-${part}`);
        if (part === '1') return Response.json({ error: 'Part failed' }, { status: 500 });
        await pending;
        events.push(`settled-${part}`);
        return Response.json({ etag: `etag-${part}` });
      }
      events.push(options.method === 'DELETE' ? 'abort' : 'complete');
      return Response.json({ ok: true });
    } });
    const result = uploadAdminMedia(new File(['abcdefghij'], 'test.mp3', { type: 'audio/mpeg' }), 'audio', () => {});
    const rejected = assert.rejects(result, /Part failed/);
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(events, ['start-1', 'start-2', 'start-3']);
    settle();
    await rejected;
    assert.deepEqual(events, ['start-1', 'start-2', 'start-3', 'settled-2', 'settled-3', 'abort']);
    console.log('PASS: upload session binding, ordered parts, etag checks, complete file bytes and metadata, aborted sessions stay closed, and failure cleanup waits for in-flight parts.');
  } finally {
    if (previous === undefined) delete process.env.MEDIA_ROOT;
    else process.env.MEDIA_ROOT = previous;
    await fs.rm(root, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
