import type { Metadata } from "next";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/vazirmatn/wght.css";
import "./globals.css";
import "./appearance.css";
import { AppearancePreference } from "@/components/appearance-preference";
import {LearnerOnboardingGate} from "@/components/learner-onboarding-gate";
import {LearningActivityTracker} from "@/components/learning-activity-tracker";
import {PwaManager} from "@/components/pwa-manager";
import {getChatGPTUser} from "@/app/chatgpt-auth";
import { Header, Footer } from "@/components/chrome";

export const metadata: Metadata = {
  metadataBase: new URL("https://englishfluento.pooryamirzaei101.chatgpt.site"),
  title: "LingoLive — Learn English your way",
  description: "Practical English courses, lessons, stories, and speaking practice for every level.",
  manifest: "/manifest.webmanifest",
  themeColor: "#f35f86",
  openGraph: {
    title: "LingoLive",
    description: "Make English part of your day.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "LingoLive English learning" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LingoLive",
    description: "Make English part of your day.",
    images: ["/og.png"],
  },
  appleWebApp: {
    capable: true,
    title: "LingoLive",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const signedIn=!!await getChatGPTUser();
  return (
    <html lang="en">
      <body className="antialiased"><AppearancePreference/><PwaManager/><div className="app-layout"><Header/><div className="app-main"><main><LearnerOnboardingGate>{children}</LearnerOnboardingGate><LearningActivityTracker signedIn={signedIn}/></main><Footer/></div></div></body>
    </html>
  );
}
