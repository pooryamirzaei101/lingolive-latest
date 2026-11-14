import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdministrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) {
    return (
      <section className="section shell">
        <h1>Administrator access required</h1>
        <p>Sign in with the administrator account to open this private area.</p>
        <p>
          <a className="button primary" href="/login">
            Sign in
          </a>{" "}
          <a className="button secondary" href="/">
            Go home
          </a>
        </p>
      </section>
    );
  }

  return children;
}
