import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { hiddenSamples } from "@/db/schema";
import { cache } from "react";

export const hiddenSampleIds=cache(async function hiddenSampleIds(): Promise<Set<string>> {
  const rows = await getDb().select({ id: hiddenSamples.id }).from(hiddenSamples).all();
  return new Set(rows.map(row => row.id));
});

export const isSampleHidden=cache(async function isSampleHidden(id: string): Promise<boolean> {
  return !!await getDb().select({ id: hiddenSamples.id }).from(hiddenSamples).where(eq(hiddenSamples.id, id)).get();
});
