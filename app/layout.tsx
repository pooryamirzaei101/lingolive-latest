import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/chrome";

export const metadata: Metadata = {
  title: "EnglishFluento — Learn English your way",
  description: "Practical English courses, lessons, stories, and speaking practice for every level.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased"><div className="app-layout"><Header/><div className="app-main"><main>{children}</main><Footer/></div></div></body>
    </html>
  );
}
