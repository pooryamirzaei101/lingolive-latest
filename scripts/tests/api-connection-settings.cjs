const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, stubs = {}) {
  const module = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { module, exports: module.exports, require: name => name in stubs ? stubs[name] : require(name), Request, Response, URL, console });
  return module.exports;
}
let admin = true, writes = 0, youtubeTests = 0, translationTests = 0;
let row = { id: 'main', youtubeClientId: 'encrypted-client', youtubeClientSecret: 'encrypted-secret', youtubeRefreshToken: 'encrypted-refresh', assemblyKey: 'encrypted-assembly', googleKey: 'encrypted-google', translationProvider: 'google', enabled: 1 };
const db = {
  select: () => ({ from: () => ({ where: () => ({ get: async () => row }) }) }),
  insert: () => ({ values: values => ({ onConflictDoUpdate: async ({ set }) => { writes++; row = { ...row, ...values, ...set }; } }) }),
  update: () => ({ set: values => ({ where: async () => { writes++; row = { ...row, ...values }; } }) }),
};
const route = load('app/api/admin/media-integrations/route.ts', {
  '@/db': { getDb: () => db }, '@/db/schema': { mediaIntegrations: {} },
  '@/lib/admin': { isAdmin: async () => admin },
  '@/lib/youtube-captions': { youtubeToken: async () => { youtubeTests++; } },
  '@/lib/media-api-errors': load('lib/media-api-errors.ts'),
  '@/lib/translation-providers': load('lib/translation-providers.ts'),
  '@/lib/languages': load('lib/languages.ts'),
  '@/lib/media-integrations': {
    encryptKey: async value => `encrypted:${value}`, decryptKey: async value => value,
    integrationConfig: async () => ({ translationProvider: 'google', googleKey: 'saved-key' }),
    translationConnected: config => !!config.googleKey,
    translateTexts: async () => { translationTests++; return ['Hola']; },
    assemblyRequest: async () => ({}),
  },
});
const post = (body, origin = 'https://test') => route.POST(new Request('https://test/api/admin/media-integrations', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify(body),
}));
(async () => {
  admin = false;
  assert.equal((await route.GET()).status, 403);
  assert.equal((await post({ action: 'youtube-save', youtubeClientId: 'client', youtubeClientSecret: 'secret' })).status, 403);
  admin = true;
  assert.equal((await post({ action: 'youtube-save' }, 'https://evil.example')).status, 403);
  for (const bad of [12, {}, [], 'x'.repeat(501), 'secret\nheader', 'secret\rheader']) {
    const response = await post({ action: 'youtube-save', youtubeClientSecret: bad });
    assert.equal(response.status, 400);
    assert.equal((await response.json()).code, 'INVALID_CREDENTIAL');
  }
  assert.equal(writes, 0);
  assert.equal((await post({ action: 'youtube-save', youtubeClientId: '   ', youtubeClientSecret: '  ' })).status, 200);
  assert.equal(row.youtubeClientId, 'encrypted-client');
  assert.equal(row.youtubeClientSecret, 'encrypted-secret');
  assert.equal(row.youtubeRefreshToken, 'encrypted-refresh', 'Blank credentials must keep the connected account');
  const replacement = await post({ action: 'youtube-save', youtubeClientId: 'new-client', youtubeClientSecret: 'new-secret' });
  assert.equal(replacement.status, 200);
  assert.equal(replacement.headers.get('Cache-Control'), 'no-store');
  const body = await replacement.text();
  for (const secret of ['new-client', 'new-secret', 'encrypted-client', 'encrypted-secret', 'encrypted-assembly', 'encrypted-google']) assert(!body.includes(secret));
  assert.equal(row.youtubeClientId, 'encrypted:new-client');
  assert.equal(row.youtubeRefreshToken, '');
  assert.equal(row.googleKey, 'encrypted-google');
  assert.equal(row.assemblyKey, 'encrypted-assembly');
  assert.equal((await post({ action: 'youtube-test' })).status, 200);
  assert.equal(youtubeTests, 1);
  assert.equal((await post({ action: 'test', provider: 'google', language: 'es' })).status, 200);
  assert.equal(translationTests, 1);
  assert.equal((await post({ action: 'youtube-disconnect' })).status, 200);
  row = null;
  assert.equal((await post({ action: 'youtube-save', youtubeClientId: 'client' })).status, 400);
  console.log('PASS: admin/origin protection, OAuth credential validation, blank-key preservation, credential replacement and reconnect, safe status responses, other-provider preservation, test/disconnect actions, incomplete setup. No external calls.');
})().catch(error => { console.error(error); process.exit(1); });
