import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { hiddenSamples } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { sampleCatalog } from "@/lib/sample-catalog";

export async function POST(request: Request) {
  if (!await isAdmin()) return Response.json({ error: "Not authorized" }, { status: 403 });
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "Invalid request origin" }, { status: 403 });
  const data = await request.json().catch(() => ({})) as { id?: string };
  if (!sampleCatalog.some(item => item.id === data.id)) return Response.json({ error: "Unknown example" }, { status: 400 });
  try {
    await getDb().insert(hiddenSamples).values({ id: data.id!, hiddenAt: Date.now() }).onConflictDoNothing();
    return Response.json({ hidden: true });
  } catch { return Response.json({ error: "Could not remove the example." }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  if (!await isAdmin()) return Response.json({ error: "Not authorized" }, { status: 403 });
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "Invalid request origin" }, { status: 403 });
  const data = await request.json().catch(() => ({})) as { id?: string };
  if (!sampleCatalog.some(item => item.id === data.id)) return Response.json({ error: "Unknown example" }, { status: 400 });
  try {
    await getDb().delete(hiddenSamples).where(eq(hiddenSamples.id, data.id!));
    return Response.json({ hidden: false });
  } catch { return Response.json({ error: "Could not restore the example." }, { status: 500 }); }
}
