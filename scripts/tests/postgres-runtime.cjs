const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { test, before, after } = require('node:test');
const ts = require('typescript');
const { PGlite } = require('@electric-sql/pglite');
const { drizzle } = require('drizzle-orm/pglite');
const { migrate } = require('drizzle-orm/pglite/migrator');
const { eq } = require('drizzle-orm');

function load(file, stubs = {}) {
  const module = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText, {
    module, exports: module.exports, require: name => name in stubs ? stubs[name] : require(name),
    process: { env: { DATABASE_URL: 'postgres://unused' } }, Date, Response, Request, Headers,
  }, { filename: file });
  return module.exports;
}

const schema = load('db/schema.ts');
const pg = new PGlite();
const raw = drizzle(pg, { schema });
const db = load('db/index.ts', {
  postgres: () => ({}), 'drizzle-orm/postgres-js': { drizzle: () => raw },
  './schema': schema, '@/lib/vps-media-store': { getVpsMediaStore() {} },
}).getDb();
const payments = load('lib/payments.ts', {
  '@/db': { getDb: () => db }, '@/db/schema': schema, '@/lib/membership': {},
  '@/lib/media-integrations': {}, '@/lib/payment-rules': {},
});

before(async () => {
  await pg.exec('CREATE ROLE anon; CREATE ROLE authenticated;');
  await migrate(raw, { migrationsFolder: 'supabase/migrations' });
});
after(async () => { await pg.close(); });

test('batch writes are atomic on PostgreSQL and roll back on failure', async () => {
  await db.batch([
    db.insert(schema.learnerPreferences).values({ userId: 'batch-user', translationLanguage: 'fa' }),
    db.insert(schema.memberships).values({ userId: 'batch-user', expiresAt: 10 }),
  ]);
  assert.equal((await db.select().from(schema.memberships).where(eq(schema.memberships.userId, 'batch-user')).get()).expiresAt, 10);
  await assert.rejects(() => db.batch([
    db.update(schema.memberships).set({ expiresAt: 20 }).where(eq(schema.memberships.userId, 'batch-user')),
    db.insert(schema.learnerPreferences).values({ userId: 'batch-user', translationLanguage: 'es' }),
  ]));
  assert.equal((await db.select().from(schema.memberships).where(eq(schema.memberships.userId, 'batch-user')).get()).expiresAt, 10);
});

test('transaction callbacks support get/all and roll back their writes', async () => {
  await assert.rejects(() => db.transaction(async tx => {
    await tx.insert(schema.memberships).values({ userId: 'rollback-user', expiresAt: 30 });
    assert.equal((await tx.select().from(schema.memberships).where(eq(schema.memberships.userId, 'rollback-user')).get()).expiresAt, 30);
    assert.ok((await tx.select().from(schema.memberships).all()).length);
    throw new Error('rollback marker');
  }), /rollback marker/);
  assert.equal(await db.select().from(schema.memberships).where(eq(schema.memberships.userId, 'rollback-user')).get(), undefined);
});

test('payment callbacks grant once, preserve longer access, and ignore nonpending orders', async () => {
  const now = Date.now(), expiry = now + 600000;
  await db.insert(schema.paymentOrders).values({
    id: 'order-one', userId: 'payer', provider: 'stripe', plan: 'monthly',
    region: 'international', amount: 1200, currency: 'eur', createdAt: now,
  });
  await Promise.all([
    payments.grantOrder('order-one', expiry, 'sub-one', 'customer-one'),
    payments.grantOrder('order-one', expiry + 600000, 'sub-one', 'customer-one'),
  ]);
  const granted = await db.select().from(schema.memberships).where(eq(schema.memberships.userId, 'payer')).get();
  await payments.grantOrder('order-one', expiry + 1200000);
  assert.equal((await db.select().from(schema.memberships).where(eq(schema.memberships.userId, 'payer')).get()).expiresAt, granted.expiresAt);
  assert.equal((await db.select().from(schema.paymentOrders).where(eq(schema.paymentOrders.id, 'order-one')).get()).status, 'paid');
  await db.insert(schema.paymentOrders).values({ id: 'order-two', userId: 'payer', provider: 'stripe', plan: 'monthly', region: 'international', amount: 1200, currency: 'eur', createdAt: now });
  await assert.rejects(() => payments.grantOrder('order-two', now - 1), /invalid/);
  await payments.grantOrder('order-two', now + 100000);
  assert.equal((await db.select().from(schema.memberships).where(eq(schema.memberships.userId, 'payer')).get()).expiresAt, granted.expiresAt);
  await db.insert(schema.paymentOrders).values({ id: 'order-failed', userId: 'failed-payer', provider: 'stripe', plan: 'monthly', region: 'international', amount: 1200, currency: 'eur', status: 'failed', createdAt: now });
  await payments.grantOrder('order-failed', expiry);
  assert.equal(await db.select().from(schema.memberships).where(eq(schema.memberships.userId, 'failed-payer')).get(), undefined);
});

test('the migration journal includes the server-only access migration', () => {
  const journal = JSON.parse(fs.readFileSync('supabase/migrations/meta/_journal.json', 'utf8'));
  assert.ok(journal.entries.some(entry => entry.tag === '0001_lock_down_public_tables'));
});

test('the standard migrator enables RLS and denies browser roles table access', async () => {
  const tables = await pg.query("SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public'");
  assert.ok(tables.rows.length > 30);
  for (const table of tables.rows) assert.equal(table.rowsecurity, true, table.tablename);
  const privileges = await pg.query("SELECT has_table_privilege('anon','public.memberships','SELECT') AS anon, has_table_privilege('authenticated','public.memberships','INSERT') AS authenticated");
  assert.equal(privileges.rows[0].anon, false);
  assert.equal(privileges.rows[0].authenticated, false);
});

test('a failed membership write rolls the payment order back to pending', async () => {
  await pg.exec("ALTER TABLE memberships ADD CONSTRAINT test_payment_rollback CHECK (user_id <> 'rollback-payer')");
  await db.insert(schema.paymentOrders).values({ id: 'order-rollback', userId: 'rollback-payer', provider: 'stripe', plan: 'monthly', region: 'international', amount: 1200, currency: 'eur', createdAt: Date.now() });
  await assert.rejects(() => payments.grantOrder('order-rollback', Date.now() + 600000));
  assert.equal((await db.select().from(schema.paymentOrders).where(eq(schema.paymentOrders.id, 'order-rollback')).get()).status, 'pending');
  await pg.exec('ALTER TABLE memberships DROP CONSTRAINT test_payment_rollback');
});

test('verified renewal invoices extend access without shortening a newer paid period', async () => {
  const later = Math.floor(Date.now() / 1000) + 10000;
  let period = later;
  const webhook = load('app/api/payments/webhook/route.ts', {
    '@/db': { getDb: () => db }, '@/db/schema': schema,
    '@/lib/membership': { prices: async () => ({ webhookKey: 'test-only' }) },
    '@/lib/media-integrations': { decryptKey: async key => key },
    '@/lib/payment-rules': { verifyStripeSignature: async () => true },
    '@/lib/payments': { stripeRequest: async path => path.startsWith('invoices/')
      ? { paid: true, subscription: 'sub-one', lines: { data: [{ type: 'subscription', subscription: 'sub-one', period: { end: period } }] } }
      : { id: 'sub-one', metadata: { userId: 'payer' } } },
  });
  const send = () => webhook.POST(new Request('https://test/api/payments/webhook', {
    method: 'POST', body: JSON.stringify({ type: 'invoice.paid', data: { object: { id: 'invoice-one' } } }),
  }));
  assert.equal((await send()).status, 200);
  assert.equal((await db.select().from(schema.memberships).where(eq(schema.memberships.userId, 'payer')).get()).expiresAt, later * 1000);
  period = later - 1000;
  assert.equal((await send()).status, 200);
  assert.equal((await db.select().from(schema.memberships).where(eq(schema.memberships.userId, 'payer')).get()).expiresAt, later * 1000);
});
