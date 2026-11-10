import type { AnchorHTMLAttributes, ReactNode } from "react";

type VpsLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children?: ReactNode;
  href: string | URL | { pathname?: string };
  prefetch?: boolean | null;
};

// The Vinext client router currently selects a Cloudflare-only prefetch path
// in a normal Node build. Full-page links are reliable on the VPS and retain
// standard browser behavior, accessibility, and progressive enhancement.
export default function VpsLink({ href, prefetch: _prefetch, ...props }: VpsLinkProps) {
  const target = typeof href === "string" || href instanceof URL
    ? href.toString()
    : href.pathname || "/";
  return <a href={target} {...props} />;
}
