import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
const bindings=env as unknown as {DB:D1Database;BUCKET:R2Bucket};
export function getDb(){return drizzle(bindings.DB, {schema})}
export function getMediaBucket(){return bindings.BUCKET}
