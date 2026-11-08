import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { SQLWrapper, ColumnsSelection } from "drizzle-orm";
import type { JoinNullability, SelectMode } from "drizzle-orm/query-builders/select.types";
import * as schema from "./schema";
import { getVpsMediaStore } from "@/lib/vps-media-store";

// These methods are provided by the compatibility proxy below. Retaining the
// native select types lets callers infer schema rows instead of receiving any.
declare module "drizzle-orm/pg-core/query-builders/select" {
  interface PgSelectBase<TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TNullabilityMap extends Record<string, JoinNullability>, TDynamic extends boolean, TExcludedMethods extends string, TResult extends any[], TSelectedFields extends ColumnsSelection> {
    get(): Promise<TResult[number] | undefined>;
    all(): Promise<TResult>;
  }
}

type Database = PostgresJsDatabase<typeof schema> & {
  batch(queries: SQLWrapper[]): Promise<unknown[]>;
};
let database: Database | undefined;

function d1Compatible<T extends object>(value: T): T {
  return new Proxy(value, {
    get(target, property) {
      if (property === "batch") {
        return (queries: SQLWrapper[]) => (target as any).transaction(async (tx: any) => {
          const results = [];
          for (const query of queries) results.push(await tx.execute(query.getSQL()));
          return results;
        });
      }
      if (property === "transaction") {
        return (callback: (tx: object) => unknown, ...options: unknown[]) =>
          (target as any).transaction((tx: object) => callback(d1Compatible(tx)), ...options);
      }
      if (property === "get") {
        return async () => {
          const rows = await (target as any);
          return rows[0];
        };
      }
      if (property === "all") return async () => await (target as any);
      const member = Reflect.get(target, property, target);
      if (property === "then" && typeof member === "function") return member.bind(target);
      if (typeof member === "function") {
        return (...args: unknown[]) => {
          const result = member.apply(target, args);
          return result && typeof result === "object" ? d1Compatible(result) : result;
        };
      }
      return member;
    },
  });
}

export function getDb(): Database {
  if (database) return database;
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) throw new Error("DATABASE_URL is not configured.");
  const client = postgres(connectionString, {
    max: Number(process.env.DATABASE_POOL_SIZE || 8),
    idle_timeout: 20,
    connect_timeout: 15,
    ssl: process.env.DATABASE_SSL === "false" ? false : "require",
  });
  database = d1Compatible(drizzle(client, { schema })) as unknown as Database;
  return database;
}

export function getMediaBucket() {
  return getVpsMediaStore();
}
