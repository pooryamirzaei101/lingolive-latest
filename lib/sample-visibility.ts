import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { hiddenSamples } from "@/db/schema";

export async function hiddenSampleIds(): Promise<Set<string>> {
  const rows = await getDb().select({ id: hiddenSamples.id }).from(hiddenSamples).all();
  return new Set(rows.map(row => row.id));
}

export async function isSampleHidden(id: string): Promise<boolean> {
  return !!await getDb().select({ id: hiddenSamples.id }).from(hiddenSamples).where(eq(hiddenSamples.id, id)).get();
}
