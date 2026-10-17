import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdministrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) notFound();
  return children;
}
